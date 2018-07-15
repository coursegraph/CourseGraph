module department_info;
public import department_info.model: DepartmentInfo;
public import department_info.fetch_info: fetchInfo;
public import department_info.fetch_courses: fetchCourses;
public import department_info.fetch_faculty: fetchFaculty;
import std.format: format;

DepartmentInfo fetchDepartment (string baseUrl, string departmentId) {
    return new DepartmentInfo(baseUrl, departmentId)
        .fetchInfo()
        .fetchCourses()
        .fetchFaculty()
    ;
}

unittest {
    auto dept = fetchDepartment("https://registrar.ucsc.edu/catalog/archive/17-18/programs-courses/", "math");
    assert(dept.departmentId == "MATH", 
        format("Expected department id = 'MATH', not '%s'", dept.departmentId));
    assert(dept.programUrl == "https://registrar.ucsc.edu/catalog/archive/17-18/programs-courses/program-statements/math.html",
        format("Expected program url = '...', not '%s'", dept.programUrl));
    assert(dept.coursesUrl == "https://registrar.ucsc.edu/catalog/archive/17-18/programs-courses/course-descriptions/math.html",
        format("Expected course url = '...', not '%s'", dept.coursesUrl));
    assert(dept.facultyUrl == "https://registrar.ucsc.edu/catalog/archive/17-18/programs-courses/faculty/math.html",
        format("Expected faculty url = '...', not '%s'", dept.facultyUrl));
 
    assert(!dept.error, format("Got exception:\n\t%s", dept.error));
    assert(dept.catalogVersion == "2017-18 General Catalog");
    assert(dept.departmentName == "Mathematics");
    assert(dept.departmentUrl == "http://www.math.ucsc.edu");
    assert(dept.departmentAddress == "4111 McHenry");
    assert(dept.departmentPhoneNumber == "(831) 459-2969");

    assert("Richard Montgomery" in dept.faculty);
    assert(dept.faculty["Richard Montgomery"].name == "Richard Montgomery");
    assert(dept.faculty["Richard Montgomery"].title == "Professor");
    assert(dept.faculty["Richard Montgomery"].department == "MATH");
    assert(dept.faculty["Richard Montgomery"].description == 
        "Celestial mechanics, differential geometry, gauge theory, mechanics (quantum and classical), and singularity theory");

    assert("Marvin J. Greenberg" in dept.faculty);
    assert(dept.faculty["Marvin J. Greenberg"].name == "Marvin J. Greenberg");
    assert(dept.faculty["Marvin J. Greenberg"].title == "Emeriti");
    assert(dept.faculty["Marvin J. Greenberg"].department == "MATH");
    assert(dept.faculty["Marvin J. Greenberg"].description == "");

    assert("Daniele Venturi (Applied Math and Statistics)" !in dept.faculty);
    assert("Daniele Venturi" !in dept.faculty);

    assert("MATH 19B" in dept.courses);
    assert(dept.courses["MATH 19B"].name == "MATH 19B");
    assert(dept.courses["MATH 19B"].title == "Calculus for Science, Engineering, and Mathematics");
    assert(dept.courses["MATH 19B"].division == "lower-division");
    assert(dept.courses["MATH 19B"].terms == "FWS");
    assert(dept.courses["MATH 19B"].instructor == "The Staff");
    assert(dept.courses["MATH 19B"].description == 
        "The definite integral and the fundamental theorem of calculus. Areas, volumes. Integration by parts, "~
        "trigonometric substitution, and partial fractions methods. Improper integrals. Sequences, series, "~
        "absolute convergence and convergence tests. Power series, Taylor and Maclaurin series. Students "~
        "cannot receive credit for both this course and course 11B, Applied Math and Statistics 11B and 15B, "~
        "or Economics 11B. Prerequisite(s): course 19A or 20A or AP Calculus AB exam score of 4 or 5, or BC "~
        "exam score of 3 or higher, or IB Mathematics Higher Level exam score of 5 of higher");

    assert("MATH 249B" in dept.courses);
    assert(dept.courses["MATH 19B"].name == "MATH 249B");
    assert(dept.courses["MATH 19B"].title == "Mechanics II");
    assert(dept.courses["MATH 19B"].division == "graduate");
    assert(dept.courses["MATH 19B"].terms == "*");
    assert(dept.courses["MATH 19B"].instructor == "The Staff");
    assert(dept.courses["MATH 19B"].description == 
        "Covers symplectic geometry and classical Hamiltonian dynamics. Some of the key subjects are the Darboux "~
        "theorem, Poisson brackets, Hamiltonian and Langrangian systems, Legendre transformations, variational "~
        "principles, Hamilton-Jacobi theory, godesic equations, and an introduction to Poisson geometry. Courses "~
        "208 and 209 are recommended as preparation. Courses 208 and 209 recommended as preparation. Enrollment "~
        "restricted to graduate students");
}
