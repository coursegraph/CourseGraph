import std.stdio;
import std.net.curl: get, CurlException;
import std.format: format;
import arsd.dom;


void processRegistrarCoursePage (string dept) {
    // Get URL for a department's course page
    string url = format(
        "https://registrar.ucsc.edu/catalog/programs-courses/course-descriptions/%s.html",
        dept);

    try {
        writefln("Fetching dept course page '%s' with url '%s'", dept, url);
        
        // Fetch page using https get (from std.net.curl)
        char[] result = get(url);

        // Load document using DOM parser coursety of arsd.dom
        auto document = new Document(cast(string)result);
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

        try {
            // Should fail; demonstrates helpful error messages for dom selectors
            auto foo = document
                .requireSelector("foo");
        } catch (ElementNotFoundException e) {
            writefln("%s", e);
        }
    } catch (CurlException e) {
        writefln("Couldn't fetch dept course page '%s' with url '%s'", dept, url);
    }
    writefln("");
}

void main()
{
    processRegistrarCoursePage("math");
    processRegistrarCoursePage("fubar");
}
