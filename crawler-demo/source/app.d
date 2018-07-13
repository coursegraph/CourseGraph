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
    string division;
    string description;
    string instructor;
    string prereqs;
    string coreqs;
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

        size_t[] sectionIndices;
        size_t k = 0;
        for (; content[k]; ++k) {
            if (content[k].tagName == "h2") {
                sectionIndices ~= k;
            }
        }
        sectionIndices ~= k;
        enforce(sectionIndices.length >= 2, 
            format("Not enough section indices (expected 2+, got %s)",
                sectionIndices.length));

        writefln("\nHeader section: (%s element(s))", sectionIndices[0]);
        foreach (i; 0 .. sectionIndices[0]) {
            auto text = content[i].innerText;
            if (text) {
                writefln("\t%s", text);
            }
        }
        string coursePrefix = dept.toUpper; coursePrefix ~= ' ';
        string divisionName = "N/A";
        foreach (j; 1 .. sectionIndices.length) {
            writefln("\nSection %s (%s element(s))", j, sectionIndices[j] - sectionIndices[j - 1]);
            foreach (i; sectionIndices[j - 1] .. sectionIndices[j]) {
                int status = 0;
                CourseEntry result;
                auto inner = content[i];
                if (inner.tagName == "h2") {
                    auto text = inner.innerText;
                    auto match = matchFirst(text,
                        ctRegex!`([\w\-]+)\s+Courses`);
                    if (match) {
                        divisionName = match[1];
                    } else {
                        writefln("Invalid input for division name: '%s'", text);
                    }
                    continue;
                }
                bool touched = false;
                for (size_t n = 0; inner[n]; ++n) {
                    writefln("%d: %s '%s'", status, inner[n].tagName, inner[n].innerHTML);
                    switch (status) {
                        case 0: {
                            if (inner[n].tagName == "strong") {
                                auto text = inner[n].innerText;
                                auto match = matchFirst(text, ctRegex!`(\d+[A-Z]?)\.`);
                                if (match) {
                                    result.name = coursePrefix ~ match[1];
                                    result.division = divisionName;
                                    touched = true;
                                    ++status;
                                } else {
                                    writefln("Invalid input for course number: '%s'", text);
                                    status = -1;
                                }
                            } else if (inner[n].tagName == "#text" && inner[n].innerText.length == 0) {
                            } else {
                                writefln("Unexpected tag: '%s' %s", inner[n].tagName, inner[n].innerText);
                            }
                        } break;
                        case 1: {
                            if (inner[n].tagName == "strong") {
                                result.title = inner[n].innerText.strip;
                                ++status;
                            } else if (inner[n].tagName == "#text" && inner[n].innerText.length == 0) {
                            } else {
                                writefln("Unexpected tag: '%s' %s", inner[n].tagName, inner[n].innerText);
                            }
                        } break;
                        case 2: {
                            if (inner[n].tagName == "strong") {
                                auto text = inner[n].innerText.strip;
                                if (text[0] == '(') {
                                    auto match = matchFirst(text, ctRegex!`\((\d+)\s+credits?|no credit\)`);
                                    if (match) {
                                        string str = match[1];
                                        if (!str.length) str = "-1";
                                        result.credits = parse!int(str);
                                    } else {
                                        writefln("Invalid input for credit field: '%s'", text);
                                    }
                                } else {
                                    --n;
                                }
                                ++status;
                            } else if (inner[n].tagName == "#text" && inner[n].innerText.length == 0) {
                            } else {
                                writefln("Unexpected tag: '%s' %s", inner[n].tagName, inner[n].innerText);
                            }
                        } break;
                        case 3: {
                            if (inner[n].tagName == "br") { ++status; --n; }
                            else if (inner[n].tagName == "strong") {
                                result.quartersOffered = inner[n].innerText.strip;
                                ++status;
                            } else if (inner[n].tagName == "#text" && inner[n].innerText.length == 0) {
                            } else {
                                writefln("Unexpected tag: '%s' %s", inner[n].tagName, inner[n].innerText);
                            }
                        } break;
                        case 4: {
                            if (inner[n].tagName == "br") {}
                            else if (inner[n].tagName == "em") { ++status; --n; }
                            else if (inner[n].tagName == "#text" && inner[n].innerText.length != 0) {
                                ++status;
                                result.description = inner[n].innerText.strip;
                            } else if (inner[n].tagName == "#text" && inner[n].innerText.length == 0) {
                            } else {
                                writefln("Unexpected tag: '%s' %s", inner[n].tagName, inner[n].innerText);
                            } 
                        } break;
                        case 5: {
                            if (inner[n].tagName == "em") {
                                result.instructor = inner[n].innerText.strip;
                            } else if (inner[n].tagName == "#text" && inner[n].innerText.length == 0) {
                            } else {
                                writefln("Unexpected tag: '%s' %s", inner[n].tagName, inner[n].innerText);
                            }
                        } break;
                        default: {
                            writefln("unhandled element: '%s': '%s'",
                                inner[n].tagName, inner[n].innerText);
                        }
                    }
                }
                if (touched) {
                    //writefln("\t%s", inner.innerText);
                    writefln("\t%s", result);
                }

                //for (size_t n = 0; inner[n]; ++n) {
                //    writefln("\t%s => %s", inner[n].tagName, inner[n].innerText);
                //}
                //if (auto elems = content[i].selector("strong")) {
                //    for (size_t k = 0; elems[k]; ++k) {
                //        writefln("\t\t%s", elems[k].innerText);
                //    }
                //}
                //auto text = content[i].innerText;
                //if (text) {
                //    writefln("\t%s", text);
                //}
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
