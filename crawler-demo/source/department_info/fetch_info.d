module department_info.fetch_info;
import department_info.model;
import util.fetch_html: fetchHtml;
import util.search_utils: childRange, regexMatch;
import std.stdio;
import arsd.dom;

DepartmentInfo fetchInfo (DepartmentInfo dept) {
    fetchHtml(dept.programUrl, dept.error, (Document document) {
        auto main = document
            .requireSelector("body")
            .requireSelector("div[id=wrap]")
            .requireSelector("div[id=container]")
            .requireSelector("div[id=sprflt]")
            .requireSelector("div[id=main]");

        dept.departmentName = main
            .requireSelector("h1[id=title]")
            .innerText;

        auto content = main.requireSelector("div[class~=content]")
            .childRange
            .requireSeq((child) { 
                return child.tagName == "p" &&
                    child.regexMatch!`(\d+\-\d+ General Catalog)`(dept.catalogVersion); 
            })
            .requireSeq((child) {
                return child.tagName == "p" &&
                    child.regexMatch!`([\s.]+)`(dept.departmentAddress);
            })
            .requireSeq((child) { 
                return child.tagName == "hr";
            });

        while (!content.empty) {
            for (; !content.empty && content.front.tagName != "h1" && content.front.tagName != "h2"; content.popFront) {}
            if (content.empty) break;

            string section = content.moveFront.innerText;
            writefln("Got section: '%s'", section);
        }
    });
    return dept;
}
