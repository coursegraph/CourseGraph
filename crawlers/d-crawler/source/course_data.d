module course_data;
import std.format: format;

struct CourseEntry {
    string name;
    string title;
    int credits;
    string quartersOffered;
    string departmentTitle;
    string division;
    string rawDescription;
    string description;
    string instructor;
    string prereqs;
    string coreqs;
    bool gradOnly = false;
    bool requiresInstructorPermission = false;
    bool mayBeRepeatedForCredit = false;
    bool satisfiesAmericanHistoryReq = false;
    string enrollmentRestrictions;
    string geCategories;
    string courseAlias;
    int enrollLimit = 0;


    string toString () {
        return format(`
        {
            "course_name": "%s",
            "course_title": "%s",
            "department": "%s",
            "credits": "%d",
            "terms": "%s",
            "division": "%s",
            "instructor": "%s",
            "description": "%s",
            "prereqs": "%s",
            "coreqs": "%s",
            "enrollment_restrictions": "%s",
            "requires_instructor_permission": "%s",
            "repeatable_for_credit": "%s",
            "satisfies_american_history_and_institutions_req": "%s",
            "alias": "%s",
            "ge_categories": "%s",
            "enroll_limit": %d,
            "raw_description": "%s",
        },`, name, title, departmentTitle, credits, quartersOffered, division, instructor, description, 
            prereqs, coreqs, enrollmentRestrictions, requiresInstructorPermission,
            mayBeRepeatedForCredit, satisfiesAmericanHistoryReq, courseAlias, geCategories, enrollLimit, rawDescription);
    }
}