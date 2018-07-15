module department_info.fetch_info;
import department_info.model;
import util.fetch_html: fetchHtml;
import util.search_utils: childRange, regexMatch;
import std.stdio;
import std.regex;
import std.exception: enforce;
import std.string: strip;
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

        auto content = main.requireSelector("div[class~=content]");
        try {
            auto sections = content.childRange
                .requireSeq((child) { 
                    return child.tagName == "p" && child.regexMatch!`(\d+\-\d+ General Catalog)`(dept.catalogVersion);
                })
                .requireSeq((child) {
                    //writefln("Got <%s>: %s", child.tagName, child.innerText);
                    if (!(child.tagName == "p" && child.innerText.strip() != "" && child.regexMatch!`(.[^\n]+)`(dept.departmentAddress))) {
                        return false;
                    }
                    auto match = matchFirst(child.innerText, ctRegex!(`(?:([\(\)\d\-\s]+)[\n\s]+)?(http.+)`, "g"));
                    enforce(match, format("Could not find contact info in '%s'", child.innerText));
                    dept.departmentPhoneNumber = match[1].strip();
                    dept.departmentUrl = match[2];
                    return true;
                })
                //.requireSeq((child) { 
                //    return child.tagName == "hr"
                //});
                //.splitSectionsByHeaders
            ;
        } catch (Throwable e) {
            writefln("\u001b[36mError parsing document.\n\u001b[31m%s\n\n"~
                "\u001b[33mContent dump:\n%s\n\u001b[0m",
                e, content.innerHTML);
        }
    });
    return dept;
}
