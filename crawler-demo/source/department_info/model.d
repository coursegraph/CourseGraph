module department_info.model;
public import std.format: format;
import std.string: toUpper, toLower;


class DepartmentInfo {
public:
    string departmentId;
    string programUrl;
    string coursesUrl;
    string facultyUrl;
    Exception error = null;

    string catalogVersion;
    string departmentName;
    string departmentUrl;
    string departmentAddress;
    string departmentPhoneNumber;
    string lastCourseRevisionDate;

    string rawProgramStatement;

    FacultyListing[string] faculty;
    CourseListing[string] courses;

    struct ProgramListing {
        string section;
        string content;
    }
    struct FacultyListing {
        string name;
        string title;
        string department;
        string description;
    }
    struct CourseListing {
        string name;
        string title;
        string division;
        string terms;
        string instructor;
        string description;
        string geCategories;
    }

    this (string baseUrl, string departmentId) {
        departmentId = departmentId.toLower;
        this.departmentId = departmentId.toUpper;
        this.programUrl = format("%s/program-statements/%s.html", baseUrl, departmentId);
        this.coursesUrl = format("%s/course-descriptions/%s.html", baseUrl, departmentId);
        this.facultyUrl = format("%s/faculty/%s.html", baseUrl, departmentId);
    }
}
