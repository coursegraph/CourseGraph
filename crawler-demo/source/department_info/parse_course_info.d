module department_info.parse_course_info;
import department_info.model;
import utils.expect: expect;
import std.regex;


bool parseCourseNumber (DepartmentInfo context, ref string s, out string result) {
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

