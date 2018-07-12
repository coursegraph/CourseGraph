import std.stdio;
import std.net.curl: get, CurlException;
import std.format: format;
import std.exception: enforce;
import std.parallelism: parallel;
import arsd.dom;

immutable bool RUN_PARALLEL = false;

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
        foreach (j; 1 .. sectionIndices.length) {
            writefln("\nSection %s (%s element(s))", j, sectionIndices[j] - sectionIndices[j - 1]);
            foreach (i; sectionIndices[j - 1] .. sectionIndices[j]) {
                auto text = content[i].innerText;
                if (text) {
                    writefln("\t%s", text);
                }
            }
        }
    } catch (CurlException e) {
        writefln("Couldn't fetch dept course page '%s' with url '%s'", dept, url);
    }
    writefln("");
}

void main()
{
    string[] depts = [
        "acen", "anth", "aplx", "art", "artg", "havc", "arts", "astr", "bioc", "eeb", "mcdb", "mcdb", "chem", "chin", "clst", "cogs", "clni", "clte", "cmmu", "cowl", "cres", "crwn", "danm", "eart", "east", "econ", "educ", "ams", "beng", "bme", "cmpm", "cmpe", "cmps", "ee", "engr", "tim", "envs", "fmst", "film", "fren", "germ", "gmst", "gree", "hebr", "his", "havc", "hisc", "humn", "ital", "itst", "japn", "jwst", "krsg", "laal", "lnst", "latn", "lals", "lgst", "ling", "lit", "ocea", "math", "merr", "metx", "musc", "oaks", "ocea", "phil", "pbs", "phye", "phys", "poli", "prtr", "port", "psyc", "punj", "qsex", "crsn", "reli", "russ", "scic", "sced", "socd", "socs", "socy", "sphs", "spst", "stev", "sust", "thea", "ucdc", "writ", "yidd" 
    ];
    static if (RUN_PARALLEL) {
        foreach (dept; parallel(depts)) {
            processRegistrarCoursePage(dept);
        }
    } else {
        foreach (dept; depts) {
            processRegistrarCoursePage(dept);
        }
    }
}
