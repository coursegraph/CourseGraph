module department_info.fetch_faculty;
import department_info.model;
import util.fetch_html: fetchHtml;
import util.search_utils: childRange, regexMatch;
import std.stdio;
import std.regex;
import std.exception: enforce;
import std.string: strip;
import arsd.dom;

DepartmentInfo fetchFaculty (DepartmentInfo dept) {
    fetchHtml(dept.facultyUrl, dept.error, (Document document) {
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
            if (section == "♦ ♦ ♦" || section == "") continue;

            writefln("Section %s:", section);
            foreach (item; items) {
                auto text = item.innerText.strip();
                if (text == "") { continue; }
                auto match = matchFirst(text, ctRegex!`(\w+\s+(?:\w\.\s+)?\w+)\s*([^\n]+)?`);
                enforce(match, format("Could not match professor listing...? '%s'", text));
                auto name = match[1].strip();
                auto description = match[2].strip();
                enforce(name !in dept.faculty, format("'%s' already exists in dept.faculty", name));
                dept.faculty[name] = DepartmentInfo.FacultyListing(
                    name, section, dept.departmentId, description
                );
            }
        }
    });
    return dept;
}
