module department_info.fetch_courses;
import department_info.model;
import util.fetch_html: fetchHtml;
import util.search_utils: childRange, regexMatch;
import std.stdio;
import std.regex;
import std.exception: enforce;
import std.string: strip, toLower;
import std.array: replace;
import arsd.dom;

DepartmentInfo fetchCourses (DepartmentInfo dept) {
    fetchHtml(dept.coursesUrl, dept.error, (Document document) {
        auto main = document
            .requireSelector("body")
            .requireSelector("div[id=wrap]")
            .requireSelector("div[id=container]")
            .requireSelector("div[id=sprflt]")
            .requireSelector("div[id=main]");

        dept.departmentName = main
            .requireSelector("h1[id=title]")
            .innerText;

        auto content = main.requireSelector("div[class~=content]");
        auto sections = content.childRange
            .splitSectionsByHeaders;

        foreach (section, items; sections) {
            if (auto match = matchFirst(section, ctRegex!`([\w\-]+(?:\s+[\w\-])*)\s+Courses`)) {
                section = match[1].toLower;
            } else {
                writefln("Non-matching section: '%s'", section);
                continue;
            }
    
            //writefln("Section %s:", section);
            foreach (item; items) {
                //writefln("\t%s", item.innerText);
                auto text = item.innerText.strip();
                if (text == "" || matchFirst(text, ctRegex!`(\* Not offered in|\[Return to top\])`)) { continue; }
                if (auto match = matchFirst(text, ctRegex!`Revised:\s+([^\n]+)`)) {
                    dept.lastCourseRevisionDate = match[1];
                    continue;
                }

                //size_t i = 0;
                //writefln("%d: %s\n", ++i, text);
                auto courseNumber = matchFirst(text, ctRegex!`(\d+[A-Z]?)\.(?:\s+|$)`);
                enforce(courseNumber, format("Could not match course number in '%s'", text));

                string name = dept.departmentId ~ " " ~ courseNumber[1];
                text = courseNumber.post;

                //writefln("%d: %s\n", ++i, text);
                text = text.replace("U.S.", "US");

                //writefln("%d: %s\n", ++i, text);
                string title, units, terms;
                if (text.length) {
                    auto match = matchFirst(text, ctRegex!`([^\.]+)(?:\s+\((\d+)\s+units?\))?\.(?:\s+|$)`);
                    if (!match && ((match = matchFirst(text, ctRegex!`([FWS](?:,[FWS])*|\*)?\s*`)))) {
                        terms = match[1].replace(",","");
                        text = match.post;
                    } else {
                        enforce(match, format("Could not match course title in '%s'", text));
                        title = match[1];
                        units = match[2] ? match[2] : "-1";
                        text = match.post;

                        //writefln("%d: %s\n", ++i, text);
                        if (!!(match = matchFirst(text, ctRegex!`([FWS](?:,[FWS])*|\*)?\s*`))) {
                            terms = match[1].replace(",","");
                            text = match.post;
                        }
                    }
                }

                //writefln("%d: %s\n", ++i, text);
                string geCodes = null;
                if (auto match = matchFirst(text, ctRegex!(`\s+\(General Education Code\(s\):\s+([^\.\)]+)[\.\)]+`, "g"))) {
                    geCodes = match[1];
                    text = match.pre ~ match.post;
                }
                //writefln("%d: %s\n", ++i, text);
                //auto instructorMatch = matchFirst(text, ctRegex!`(?:\.\)?\s+|^)([^\.]+)\.?\s*$`);
                string instructor = null;
                if (text && text.length) {

                    // see this stupid thing here? 
                    //    \.["\)]?
                    // blame english style guides (or lack thereof...). (ie. `(fubar.) `"Baz."` etc...)

                    auto instructorMatch = matchFirst(text, ctRegex!`(?:\.["\)]?\s+|^)([^\.]+)\.?\s*$`);
                    enforce(instructorMatch, format("Could not match instructor in '%s'", text));
                    instructor = instructorMatch[1];
                    text = instructorMatch.pre;
                    //writefln("%d: %s\n", ++i, text);
                }
                //writefln("\t%s '%s' (%s units). '%s'. '%s'. %s", name, title, units, instructor, terms, text);

                if (name in dept.courses) {
                    writefln("'%s' already exists in deps.courses!", name);
                }
                dept.courses[name] = DepartmentInfo.CourseListing(
                    name, title, section, terms, instructor, text, geCodes
                );
            }
        }
    });
    return dept;
}
