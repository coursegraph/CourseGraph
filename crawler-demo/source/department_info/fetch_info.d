module department_info.fetch_info;
import department_info.model;
import util.fetch_html: fetchHtml;
import util.search_utils: range, regexMatch;
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

        auto content = main
            .requireSelector("div[class~=content]");

        content
            .range
            .requireSeq((elem) { 
                return elem.tagName == "p" &&
                    elem.regexMatch!`(\d+\-\d+ General Catalog)`(dept.catalogVersion); 
            })
            .requireSeq((elem) {
                return elem.tagName == "p" &&
                    elem.regexMatch!`([\s.]+)`(dept.departmentAddress);
            })
            .requireSeq((elem) { 
                return elem.tagName == "hr";
            })
        ;
        writefln("%s\n", content.innerText);
    });
    return dept;
}
