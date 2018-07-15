module department_info.model;
public import std.format: format;


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
    }

    this (string baseUrl, string departmentId) {
        this.departmentId = departmentId;
        this.departmentUrl = format("%s/program-statements/%s.html", baseUrl, departmentId);
        this.coursesUrl = format("%s/course-descriptions/%s.html", baseUrl, departmentId);
        this.facultyUrl = format("%s/faculty/%s.html", baseUrl, departmentId);
    }
}
