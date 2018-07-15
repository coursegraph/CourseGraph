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
import arsd.htmltotext: htmlToText;
import course_data: CourseEntry;
import department_info: fetchDepartment;

// regex: \n\s+(\d+\w?)\.\s+([\w+\s+\-:,/\'\"]+)(?:\s+\((\d+)\s+credits?|no credit\))?\.(?:\s+([FWS\*,]+))?\s+(.+)
// replace: {\n\t"course_id": "$1",\n\t"course_title": "$2",\n\t"credit(s)": "$3",\n\t"offered term(s)": "$4",\n\t"description": "$5"\n},\n

void processRegistrarCoursePage (string dept) {
    writefln("Fetching data for dept '%s'", dept);
    auto result = fetchDepartment("https://registrar.ucsc.edu/catalog/archive/17-18/programs-courses", dept);
    writefln("\n%s", result);
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
