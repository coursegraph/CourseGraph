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
    import utils.expect: expect;

    auto dept = fetchDepartment("https://registrar.ucsc.edu/catalog/archive/17-18/programs-courses", "math");
    expect(dept.departmentId).toEqual("MATH");
    expect(dept.programUrl).toEqual("https://registrar.ucsc.edu/catalog/archive/17-18/programs-courses/program-statements/math.html");
    expect(dept.coursesUrl).toEqual("https://registrar.ucsc.edu/catalog/archive/17-18/programs-courses/course-descriptions/math.html");
    expect(dept.facultyUrl).toEqual("https://registrar.ucsc.edu/catalog/archive/17-18/programs-courses/faculty/math.html");
 
    expect(dept.error).toEqual(null);
    expect(dept.catalogVersion).toEqual("2017-18 General Catalog");
    expect(dept.departmentName).toEqual("Mathematics");
    expect(dept.departmentUrl).toEqual("http://www.math.ucsc.edu");
    expect(dept.departmentAddress).toEqual("4111 McHenry");
    expect(dept.departmentPhoneNumber).toEqual("(831) 459-2969");

    expect(dept.faculty).toContain("Richard Montgomery");
    expect(dept.faculty["Richard Montgomery"].name).toEqual("Richard Montgomery");
    expect(dept.faculty["Richard Montgomery"].title).toEqual("Professor");
    expect(dept.faculty["Richard Montgomery"].department).toEqual("MATH");
    expect(dept.faculty["Richard Montgomery"].description).toEqual(
        "Celestial mechanics, differential geometry, gauge theory, mechanics (quantum and classical), and singularity theory");

    expect(dept.faculty).toContain("Richard Montgomery");
    expect(dept.faculty["Marvin J. Greenberg"].name).toEqual("Marvin J. Greenberg");
    expect(dept.faculty["Marvin J. Greenberg"].title).toEqual("Emeriti");
    expect(dept.faculty["Marvin J. Greenberg"].department).toEqual("MATH");
    expect(dept.faculty["Marvin J. Greenberg"].description).toEqual("");

    expect(dept.faculty).toNotContain("Daniele Venturi (Applied Math and Statistics)");
    expect(dept.faculty).toNotContain("Daniele Venturi");

    expect(dept.courses).toContain("MATH 19B");
    expect(dept.courses["MATH 19B"].name).toEqual("MATH 19B");
    expect(dept.courses["MATH 19B"].title).toEqual("Calculus for Science, Engineering, and Mathematics");
    expect(dept.courses["MATH 19B"].division).toEqual("lower-division");
    expect(dept.courses["MATH 19B"].terms).toEqual("FWS");
    expect(dept.courses["MATH 19B"].instructor).toEqual("The Staff");
    expect(dept.courses["MATH 19B"].description).toEqual(
        "The definite integral and the fundamental theorem of calculus. Areas, volumes. Integration by parts, "~
        "trigonometric substitution, and partial fractions methods. Improper integrals. Sequences, series, "~
        "absolute convergence and convergence tests. Power series, Taylor and Maclaurin series. Students "~
        "cannot receive credit for both this course and course 11B, Applied Math and Statistics 11B and 15B, "~
        "or Economics 11B. Prerequisite(s): course 19A or 20A or AP Calculus AB exam score of 4 or 5, or BC "~
        "exam score of 3 or higher, or IB Mathematics Higher Level exam score of 5 of higher");

    expect(dept.courses).toContain("MATH 249B");
    expect(dept.courses["MATH 19B"].name).toEqual("MATH 249B");
    expect(dept.courses["MATH 19B"].title).toEqual("Mechanics II");
    expect(dept.courses["MATH 19B"].division).toEqual("graduate");
    expect(dept.courses["MATH 19B"].terms).toEqual("*");
    expect(dept.courses["MATH 19B"].instructor).toEqual("The Staff");
    expect(dept.courses["MATH 19B"].description).toEqual(
        "Covers symplectic geometry and classical Hamiltonian dynamics. Some of the key subjects are the Darboux "~
        "theorem, Poisson brackets, Hamiltonian and Langrangian systems, Legendre transformations, variational "~
        "principles, Hamilton-Jacobi theory, godesic equations, and an introduction to Poisson geometry. Courses "~
        "208 and 209 are recommended as preparation. Courses 208 and 209 recommended as preparation. Enrollment "~
        "restricted to graduate students");
}
