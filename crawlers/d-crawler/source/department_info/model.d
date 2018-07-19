module department_info.model;
public import std.format: format;
import std.string;
import std.conv: to;
import std.array;
import std.algorithm;
import jsonizer;


class DepartmentInfo {
public:
    mixin JsonizeMe;

    @jsonize {
        string departmentId;
        string programUrl;
        string coursesUrl;
        string facultyUrl;
    }
    
    Exception error = null;

    @jsonize {
        string catalogVersion;
        string departmentName;
        string departmentUrl;
        string departmentAddress;
        string departmentPhoneNumber;
        string lastCourseRevisionDate;

        string rawProgramStatement;

        FacultyListing[string] faculty;
        CourseListing[string] courses;
    }

    struct ProgramListing {
        mixin JsonizeMe;
        @jsonize {
            string section;
            string content;
        }
        //string toString () { 
        //    return format(`{ "section": "%s", "content": "%s" }`, 
        //        section, content); 
        //}
    }
    struct FacultyListing {
        mixin JsonizeMe;
        @jsonize {
            string name;
            string title;
            string department;
            string description;
        }
        //string toString () {
        //    return format(`"%s": { "title": "%s", "dept": "%s", "description": "%s" }`,
        //        name, title, department, description);
        //}
    }
    struct CourseListing {
        mixin JsonizeMe;
        @jsonize {
            string name;
            string title;
            string division;
            string terms;
            string instructor;
            string description;
            string geCategories;
        }
        //string toString () {
        //    return format(`"%s": { "title": "%s", "division": "%s", "terms": "%s", "instructor": "%s", "description": "%s", "GE": "%s" }`,
        //        name, title, division, terms, instructor, description, geCategories);
        //}
    }

    this (string baseUrl, string departmentId) {
        departmentId = departmentId.toLower;
        this.departmentId = departmentId.toUpper;
        this.programUrl = format("%s/program-statements/%s.html", baseUrl, departmentId);
        this.coursesUrl = format("%s/course-descriptions/%s.html", baseUrl, departmentId);
        this.facultyUrl = format("%s/faculty/%s.html", baseUrl, departmentId);
    }

    //override string toString () {
    //    return format(`"%s": {
    //        "name": "%s",
    //        "courses-revision": "%s", 
    //        "etc": {
    //            "program-page": "%s",
    //            "courses-page": "%s",
    //            "faculty-page": "%s",
    //            "homepage": "%s",
    //            "address": "%s",
    //            "phone": "%s",
    //        },
    //        "faculty": {
    //            %s
    //        },
    //        "courses": {
    //            %s
    //        }
    //    }`, departmentId, departmentName, catalogVersion, programUrl, coursesUrl, facultyUrl,
    //        departmentUrl, departmentAddress, departmentPhoneNumber,
    //        faculty.values.map!"a.to!string".join(", "),
    //        courses.values.map!"a.to!string".join(", ")
    //    );
    //}
}
