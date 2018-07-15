module department_info.parse_utils;
import department_info.model;
import utils.expect: expect;
import std.regex;
import std.string;
import std.conv: parse;


public string fixSentences (ref string s) {
    return s = s.replaceAll(ctRegex!`\.(["\)]+)`, "$1.");
}
public string fixSentences (string s) {
    return fixSentences(s);
}
unittest {
    expect(fixSentences("")).toEqual("");
    expect(fixSentences(".)")).toEqual(").");
    expect(fixSentences(`."`)).toEqual(`".`);
    expect(fixSentences(`.)"`)).toEqual(`)".`);
    expect(fixSentences(`.")`)).toEqual(`").`);
    expect(fixSentences("(Hello).")).toEqual("(Hello).");
    expect(fixSentences("Hello. (World!). \"Hello\". World")).toEqual("Hello. (World!). \"Hello\". World");
    expect(fixSentences("(Hello.) \"World.\" Hello.")).toEqual("(Hello). \"World\". Hello.");
}

public bool parseCourseNumber (DepartmentInfo context, ref string s, out string result) {
    if (auto match = matchFirst(s, ctRegex!(`^(\d+[A-Z]?)\.(?:\s+|$)`))) {
        result = context.departmentId ~ " " ~ match[1];
        s = match.post;
        return true;
    }
    return false;
}

private void expectParse 
    (alias f, T, string file = __FILE__, size_t line = __LINE__)
    (DepartmentInfo context, bool returnValue, string input, T result, string output) 
{
    T outValue;
    expect!(bool, file, line)(f(context, input, outValue)).toEqual(returnValue);
    expect!(string, file, line)(input).toEqual(output);
    expect!(T, file, line)(outValue).toEqual(result);
}
unittest {
    auto info = new DepartmentInfo("", "math");
    expect(info.departmentId).toEqual("MATH");
    expectParse!parseCourseNumber(info, false, "", "", "");
    expectParse!parseCourseNumber(info, false, " 1.", "", " 1.");
    expectParse!parseCourseNumber(info, false, "M123f. asdf", "", "M123f. asdf");
    expectParse!parseCourseNumber(info, true, "1. asdf", "MATH 1", "asdf");
    expectParse!parseCourseNumber(info, true, "1234A. Fubar", "MATH 1234A", "Fubar");
    expectParse!parseCourseNumber(info, true, "1234A. Fubar", "MATH 1234A", "Fubar");
}

public bool parseCourseUnits (DepartmentInfo context, ref string s, out int result) {
    if (auto match = matchFirst(s, ctRegex!(`\s*\((\d+) units?\)`, "g"))) {
        string text = match[1];
        result = text.parse!int;
        s = match.pre ~ match.post;
        return true;
    }
    return false;
}
unittest {
    auto info = new DepartmentInfo("", "math");
    expect(info.departmentId).toEqual("MATH");
    expectParse!parseCourseUnits(info, false, "", 0, "");
    expectParse!parseCourseUnits(info, true, "(1 unit)", 1, "");
    expectParse!parseCourseUnits(info, true, "(1 unit).", 1, ".");
    expectParse!parseCourseUnits(info, true, "(1 unit). fubar", 1, ". fubar");
    expectParse!parseCourseUnits(info, true, "Foo  (20 units). fubar", 20, "Foo. fubar");
    expectParse!parseCourseUnits(info, true, "Foo  (20 units)", 20, "Foo");
    expectParse!parseCourseUnits(info, false, "Foo  (20 units.)", 0, "Foo  (20 units.)");
}

//public bool parseCourseTerm (DepartmentInfo context, ref string s, out string result) {
//    if (auto match = matchFirst(s, ctRegex!`(?:^|\s+)([FWS](?:\,[FWS])*|\*)(\s+|$)`)) {
//        result = match[1].replace(",","");
//        s = match.pre ~ match[2] ~ match.post;
//        return true;
//    }
//    return false;
//}
//unittest {
//    auto info = new DepartmentInfo("", "math");
//    expect(info.departmentId).toEqual("MATH");
//    expectParse!parseCourseTerm(info, false, "", "", "");
//    expectParse!parseCourseTerm(info, true, "*", "*", "");
//    expectParse!parseCourseTerm(info, true, "F", "F", "");
//    expectParse!parseCourseTerm(info, true, "F,W", "FW", "");
//    expectParse!parseCourseTerm(info, false, "FW", "", "FW");
//    expectParse!parseCourseTerm(info, false, "F,,W", "", "F,,W");
//    expectParse!parseCourseTerm(info, false, "F,WW", "", "F,WW");
//    expectParse!parseCourseTerm(info, true, "borg. F,W,S", "FWS", "borg.");
//    expectParse!parseCourseTerm(info, true, "borg. F,W,S asdf", "FWS", "borg. asdf");
//    expectParse!parseCourseTerm(info, true, "borg. F,W,S asdf", "FWS", "borg. asdf");
//    expectParse!parseCourseTerm(info, true, "borg. *  asdf", "*", "borg.  asdf");
//    expectParse!parseCourseTerm(info, false, "borg.* asdf", "", "borg.* asdf");
//    expectParse!parseCourseTerm(info, false, "Spring", "", "Spring");
//    expectParse!parseCourseTerm(info, true, "F Spring", "F", " Spring");
//}

//public bool parseCourseTitle (DepartmentInfo context, ref string s, out string result) {
//    return false;
//}
//unittest {
//    auto info = new DepartmentInfo("", "math");
//    expect(info.departmentId).toEqual("MATH");
//    expectParse!parseCourseTitle(info, false, "", "", "");
//    expectParse!parseCourseTitle(info, true, "*", "*", "");
//    expectParse!parseCourseTitle(info, true, "F", "F", "");
//    expectParse!parseCourseTitle(info, true, "F,W", "FW", "");
//    expectParse!parseCourseTitle(info, false, "FW", "", "FW");
//    expectParse!parseCourseTitle(info, false, "F,,W", "", "F,,W");
//    expectParse!parseCourseTitle(info, false, "F,WW", "", "F,WW");
//    expectParse!parseCourseTitle(info, true, "borg. F,W,S", "FWS", "borg.");
//    expectParse!parseCourseTitle(info, true, "borg. F,W,S asdf", "FWS", "borg. asdf");
//    expectParse!parseCourseTitle(info, true, "borg. F,W,S asdf", "FWS", "borg. asdf");
//    expectParse!parseCourseTitle(info, true, "borg. *  asdf", "*", "borg.  asdf");
//    expectParse!parseCourseTitle(info, false, "borg.* asdf", "", "borg.* asdf");
//    expectParse!parseCourseTitle(info, false, "Spring", "", "Spring");
//    expectParse!parseCourseTitle(info, true, "F Spring", "F", " Spring");
//}
//public bool parseCourseInstructor (DepartmentInfo context, ref string s, out string result) {
//    return false;
//}
//unittest {
//    auto info = new DepartmentInfo("", "math");
//    expect(info.departmentId).toEqual("MATH");
//    expectParse!parseCourseInstructor(info, false, "", "", "");
//    expectParse!parseCourseInstructor(info, true, "*", "*", "");
//    expectParse!parseCourseInstructor(info, true, "F", "F", "");
//    expectParse!parseCourseInstructor(info, true, "F,W", "FW", "");
//    expectParse!parseCourseInstructor(info, false, "FW", "", "FW");
//    expectParse!parseCourseInstructor(info, false, "F,,W", "", "F,,W");
//    expectParse!parseCourseInstructor(info, false, "F,WW", "", "F,WW");
//    expectParse!parseCourseInstructor(info, true, "borg. F,W,S", "FWS", "borg.");
//    expectParse!parseCourseInstructor(info, true, "borg. F,W,S asdf", "FWS", "borg. asdf");
//    expectParse!parseCourseInstructor(info, true, "borg. F,W,S asdf", "FWS", "borg. asdf");
//    expectParse!parseCourseInstructor(info, true, "borg. *  asdf", "*", "borg.  asdf");
//    expectParse!parseCourseInstructor(info, false, "borg.* asdf", "", "borg.* asdf");
//    expectParse!parseCourseInstructor(info, false, "Spring", "", "Spring");
//    expectParse!parseCourseInstructor(info, true, "F Spring", "F", " Spring");
//}

//public bool parseCoursePrereqs (DepartmentInfo context, ref string s, out string result) {
//    return false;
//}
//unittest {
//    auto info = new DepartmentInfo("", "math");
//    expect(info.departmentId).toEqual("MATH");
//    expectParse!parseCoursePrereqs(info, false, "", "", "");
//    expectParse!parseCoursePrereqs(info, true, "*", "*", "");
//    expectParse!parseCoursePrereqs(info, true, "F", "F", "");
//    expectParse!parseCoursePrereqs(info, true, "F,W", "FW", "");
//    expectParse!parseCoursePrereqs(info, false, "FW", "", "FW");
//    expectParse!parseCoursePrereqs(info, false, "F,,W", "", "F,,W");
//    expectParse!parseCoursePrereqs(info, false, "F,WW", "", "F,WW");
//    expectParse!parseCoursePrereqs(info, true, "borg. F,W,S", "FWS", "borg.");
//    expectParse!parseCoursePrereqs(info, true, "borg. F,W,S asdf", "FWS", "borg. asdf");
//    expectParse!parseCoursePrereqs(info, true, "borg. F,W,S asdf", "FWS", "borg. asdf");
//    expectParse!parseCoursePrereqs(info, true, "borg. *  asdf", "*", "borg.  asdf");
//    expectParse!parseCoursePrereqs(info, false, "borg.* asdf", "", "borg.* asdf");
//    expectParse!parseCoursePrereqs(info, false, "Spring", "", "Spring");
//    expectParse!parseCoursePrereqs(info, true, "F Spring", "F", " Spring");
//}
