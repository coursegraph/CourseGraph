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
            .requireSeq((child) { 
                return child.tagName == "hr";
            })
            .splitSectionsByHeaders;

        foreach (section, items; sections) {
            if (auto match = matchFirst(section, ctRegex!`([\w\-]+(?:\s+[\w\-])*)\s+Courses`)) {
                section = match[1].toLower;
            } else {
                writefln("Non-matching section: '%s'", section);
                continue;
            }
    
            writefln("Section %s:", section);
            foreach (item; items) {
                //writefln("\t%s", item.innerText);
                auto text = item.innerText.strip();
                if (text == "" || matchFirst(text, ctRegex!`(\* Not offered in|\[Return to top\])`)) { continue; }
                if (auto match = matchFirst(text, ctRegex!`Revised:\s+([^\n]+)`)) {
                    dept.lastCourseRevisionDate = match[1];
                    continue;
                }

                auto courseNumber = matchFirst(text, ctRegex!`(\d+[A-Z]?)\.\s+`);
                enforce(courseNumber, format("Could not match course number in '%s'", text));

                string name = dept.departmentId ~ " " ~ courseNumber[1];
                text = courseNumber.post;

                text = text.replace("U.S.", "US");
                auto courseTitleAndUnits = matchFirst(text, ctRegex!`([^\.]+)(?:\s+\((\d+)\s+units?\))?\.\s+`);
                enforce(courseTitleAndUnits, format("Could not match course title in '%s'", text));
                string title = courseTitleAndUnits[1];
                string units = courseTitleAndUnits[2] ? courseTitleAndUnits[2] : "-1";
                text = courseTitleAndUnits.post;


                auto instructorMatch = matchFirst(text, ctRegex!`\.\)?\s+([^\.]+)\.?\s*$`);
                enforce(instructorMatch, format("Could not match instructor in '%s'", text));
                string instructor = instructorMatch[1];
                text = instructorMatch.pre;

                writefln("\t%s '%s' (%s units). '%s'. %s", name, title, units, instructor, text);

                enforce(name !in dept.courses, format("'%s' already exists in dept.courses", name));
                dept.courses[name] = DepartmentInfo.CourseListing(
                    name, title, section, instructor, text
                );
            }
        }
    });
    return dept;
}
