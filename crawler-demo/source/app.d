import std.stdio;
import std.net.curl: get, CurlException;
import std.format: format;
import std.exception: enforce;
import std.parallelism: parallel;
import std.getopt: getopt;
import std.string: toUpper, strip;
import std.regex: matchFirst, ctRegex;
import std.conv: parse;
import arsd.dom;

// regex: \n\s+(\d+\w?)\.\s+([\w+\s+\-:,/\'\"]+)(?:\s+\((\d+)\s+credits?|no credit\))?\.(?:\s+([FWS\*,]+))?\s+(.+)
// replace: {\n\t"course_id": "$1",\n\t"course_title": "$2",\n\t"credit(s)": "$3",\n\t"offered term(s)": "$4",\n\t"description": "$5"\n},\n

struct CourseEntry {
    string name;
    string title;
    int credits;
    string quartersOffered;
    string departmentTitle;
    string division;
    string rawDescription;
    string description;
    string instructor;
    string prereqs;
    string coreqs;
    bool gradOnly = false;
    bool requiresInstructorPermission = false;
    bool mayBeRepeatedForCredit = false;
    bool satisfiesAmericanHistoryReq = false;
    string enrollmentRestrictions;
    string geCategories;
    string courseAlias;
    int enrollLimit = 0;


    string toString () {
        return format(`
        {
            "course_name": "%s",
            "course_title": "%s",
            "department": "%s",
            "credits": "%d",
            "terms": "%s",
            "division": "%s",
            "instructor": "%s",
            "description": "%s",
            "prereqs": "%s",
            "coreqs": "%s",
            "enrollment_restrictions": "%s",
            "requires_instructor_permission": "%s",
            "repeatable_for_credit": "%s",
            "satisfies_american_history_and_institutions_req": "%s",
            "alias": "%s",
            "ge_categories": "%s",
            "enroll_limit": %d,
            "raw_description": "%s",
        },`, name, title, departmentTitle, credits, quartersOffered, division, instructor, description, 
            prereqs, coreqs, enrollmentRestrictions, requiresInstructorPermission,
            mayBeRepeatedForCredit, satisfiesAmericanHistoryReq, courseAlias, geCategories, enrollLimit, rawDescription);
    }
}

void processRegistrarCoursePage (string dept) {
    // Get URL for a department's course page
    string url = format(
        "https://registrar.ucsc.edu/catalog/programs-courses/course-descriptions/%s.html",
        dept);

    try {
        writefln("Fetching dept course page '%s' with url '%s'", dept, url);
        
        // Fetch page using https get (from std.net.curl)
        char[] html = get(url);

        // Load document using DOM parser coursety of arsd.dom
        auto document = new Document(cast(string)html);
        auto main = document
            .requireSelector("body")
            .requireSelector("div[id=wrap]")
            .requireSelector("div[id=container]")
            .requireSelector("div[id=sprflt]")
            .requireSelector("div[id=main]")
        ;

        // Get + print page title
        auto title = main
            .requireSelector("h1[id=title]")
            .innerText;
        writefln("Got page title: '%s'", title);

        // Get page content (to be processed later)
        auto content = main
            .requireSelector("div[class~=content]");

        // Iterate over all children.
        // This part is a bit tricky, as it has lots of stuff glommed
        // together under the same div -_-
        size_t i = 0;
        string header;
        for (bool continue_ = true; continue_ && content[i]; ++i) {
            switch (content[i].tagName) {
                case "p": header ~= content[i].innerText; header ~= '\n'; break;
                case "hr": continue_ = false; --i; break;
                case "h2": continue_ = false; --i; break;
                default: 
                    if (content[i].tagName != "#text" || content[i].innerText.length) {
                        writefln("Unexpected tag '%s' in content header: '%s'",
                            content[i].tagName, content[i].innerHTML);
                    }
            }
        }
        writefln("Header:\n\t%s", header);
        enforce(content[i].tagName == "hr" || content[i].tagName == "h2",
            format("Expected tag 'hr', not '%s': '%s'",
                content[i].tagName, content[i].innerHTML));

        while (content[i] && content[i].tagName != "h2") ++i;
        enforce(content[i].tagName == "h2",
            format("Expected tag 'h2', not '%s': '%s'",
                content[i].tagName, content[i].innerHTML));

        string coursePrefix = dept.toUpper; coursePrefix ~= ' ';
        string divisionName = "N/A";
        void parseCourseInfo (Element elem) {
            auto text = elem.innerHTML;
            CourseEntry result;

            // Get divider between course name, title, credits, and terms (in that order),
            // and the course description and instructor info (after)
            string before, after;
            if (auto match = matchFirst(text, ctRegex!(`<br />\s*`, "g"))) {
                before = match.pre;
                after = match.post;
                //writefln("Got course description '%s'", result.description);
            } else {
                return;
                //writefln("Could not find course description in '%s'", text);
            }

            // Get instructor info + course description
            if (auto match = matchFirst(after, ctRegex!(`\s*<em>([^<]+)</em>`, "g"))) {
                result.instructor = match[1];
                after = match.pre;
                //writefln("Got course instructor(s) '%s'", result.instructor);
            } else {
                //writefln("Could not find instructor field in '%s'", text);
            }
            result.rawDescription = result.description = after;

            // Get course number => course name (REQUIRED!)
            if (auto match = matchFirst(before, ctRegex!(`<strong>(\d+[A-Z]?)\.</strong>\s*`))) {
                result.name = coursePrefix ~ match[1];
                result.division = divisionName;
                result.departmentTitle = title;
                //writefln("Got course name '%s'", result.name);
                before = match.post;
            } else {
                writefln("Could not find course name field in '%s'", text);
            }

            //
            // Match remaining items in reverse order:
            //

            // Get terms (optional)
            if (auto match = matchFirst(before, ctRegex!(`>((?:[FWS],)*[FWS]|\*)</`, "g"))) {// `((?:[FWS],)*[FWS]|\*)\s*`)) {
                result.quartersOffered = match[1];
                //writefln("Got course terms '%s'", result.quartersOffered);
                before = match.pre;
            } else {
                //writefln("Could not find course terms field in '%s'", text);
            }

            // Get credits (optional)
            if (auto match = matchFirst(before, ctRegex!(`>\((?:(\d+)\s+credits?|no credit)\)\.<`, "g"))) {
                auto str = match[1];
                if (!str.length) str = "-1";
                result.credits = parse!int(str);
                //writefln("Got course credits '%d'", result.credits);
                before = match.pre;
            } else {
                result.credits = -1;
                //writefln("Could not find course credit field in '%s'", text);
            }

            // Get course title (technically optional...)
            if (auto match = matchFirst(before, ctRegex!(`<strong>([^<]+)\.?</strong>`, "g"))) {
                result.title = match[1];
                //writefln("Got course title '%s'", result.title);
                before = match.pre;
            } else {
                writefln("Could not find course title field in '%s'\n\n\tfull:\n'%s'", before, text);
            }
            
            //
            // Further parse course description (in detail...)
            //

            if (auto match = matchFirst(result.description, ctRegex!(`\s*Enrollment limited to (\d+)\.?\s*`, "g"))) {
                string str = match[1];
                result.enrollLimit = parse!int(str);
                result.description = match.pre ~ match.post;
            }
            if (auto match = matchFirst(result.description, ctRegex!(`\s*\(General Education Code\(s\): ([^\)]+)\.?\)\s*`, "g"))) {
                result.geCategories = match[1];
                result.description = match.pre ~ match.post;
            }
            if (auto match = matchFirst(result.description, ctRegex!(`\s*Enrollment (?:is )?(?:restricted|limited) to ([^\.]+)\.?\s*`, "g"))) {
                result.enrollmentRestrictions = match[1];
                result.description = match.pre ~ match.post;
            }
            if (auto match = matchFirst(result.description, ctRegex!(`\s*Prerequisite\(s\):\s+([^\.]+)\.?\s*`, "g"))) {
                result.prereqs = match[1];
                result.description = match.pre ~ match.post;
            }
            if (auto match = matchFirst(result.description, ctRegex!(`\s*Corequisite\(s\):\s+([^\.]+)\.?\s*`, "g"))) {
                result.coreqs = match[1];
                result.description = match.pre ~ match.post;
            }
            if (auto match = matchFirst(result.description, ctRegex!(`\s*May be repeated for credit\.?\s*`, "g"))) {
                result.mayBeRepeatedForCredit = true;
                result.description = match.pre ~ match.post;
            }
            if (auto match = matchFirst(result.description, ctRegex!(`\s*Enrollment by instructor consent only\.?\s*`, "g"))) {
                result.requiresInstructorPermission = true;
                result.description = match.pre ~ match.post;
            }
            if (auto match = matchFirst(result.description, ctRegex!(`\s*Satisfies American History and Institutions Requirement\.?\s*`, "g"))) {
                result.satisfiesAmericanHistoryReq = true;
                result.description = match.pre ~ match.post;
            }
            writefln("%s", result);
        }

        for (; content[i]; ++i) {
            switch (content[i].tagName) {
                case "h2": {
                    auto text = content[i].innerText;
                    auto match = matchFirst(text,
                        ctRegex!`([\w\-]+)\s+Courses`);
                    if (match) {
                        divisionName = match[1];
                    } else {
                        writefln("Invalid input for division name: '%s'", text);
                    }
                } break;
                case "p": {
                    parseCourseInfo(content[i]);
                } break;
                case "strong": case "em": case "br": {
                    //parseCourseInfo(content);
                } break;
                default:
                    if (content[i].tagName != "#text" || content[i].innerText.length) {
                        writefln("Unexpected tag '%s' in content body: '%s'",
                            content[i].tagName, content[i].innerHTML);
                    }
            }
        }
    } catch (CurlException e) {
        writefln("Couldn't fetch dept course page '%s' with url '%s'", dept, url);
    }
    writefln("");
}

void main(string[] args)
{
    bool runParallel = false;
    args.getopt("parallel", &runParallel);

    string[] depts = [
        "acen", "anth", "aplx", "art", "artg", "havc", "arts", "astr", "bioc", "eeb", "mcdb", "mcdb", "chem", "chin", "clst", "cogs", "clni", "clte", "cmmu", "cowl", "cres", "crwn", "danm", "eart", "east", "econ", "educ", "ams", "beng", "bme", "cmpm", "cmpe", "cmps", "ee", "engr", "tim", "envs", "fmst", "film", "fren", "germ", "gmst", "gree", "hebr", "his", "havc", "hisc", "humn", "ital", "itst", "japn", "jwst", "krsg", "laal", "lnst", "latn", "lals", "lgst", "ling", "lit", "ocea", "math", "merr", "metx", "musc", "oaks", "ocea", "phil", "pbs", "phye", "phys", "poli", "prtr", "port", "psyc", "punj", "qsex", "crsn", "reli", "russ", "scic", "sced", "socd", "socs", "socy", "sphs", "spst", "stev", "sust", "thea", "ucdc", "writ", "yidd" 
    ];
    if (runParallel) {
        foreach (dept; parallel(depts)) {
            processRegistrarCoursePage(dept);
        }
    } else {
        foreach (dept; depts) {
            processRegistrarCoursePage(dept);
        }
    }
}
