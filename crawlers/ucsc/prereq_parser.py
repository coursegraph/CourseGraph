import re

tokenizer = re.compile(r'''
    (by (?:consent|permission) of instructor) |
    (satisfaction of the Entry Level Writing and Composition requirements) |
    ([Bb]asic knowledge of computer programming languages is assumed) |
    (courses?|(?:[A-Z][a-z]+(?:\s+and)?\s+)*[A-Z][a-z]+) |
    (\d+[A-Z]?) |
    (;\s+and) |
    (;\s+or) |
    (;) |
    (,\s+and) |
    (,\s+or) |
    (,) |
    (and) |
    (or) |
    (\s+) |
    (.+)
''', re.DOTALL | re.VERBOSE)

def parse_prereqs (prereqs, dept, depts):
    print("Parsing '%s'"%prereqs)
    depts['course'] = dept
    depts['courses'] = dept
    course_prefix = "N/A "
    for match in re.finditer(tokenizer, prereqs):
        (instructor_consent, writing_req, programming_req,
            course, number, 
            semi_and, semi_or, semi, 
            comma_and, comma_or, comma,
            _and, _or,
            whitespace,
            error
        ) = match.groups()
        if error:
            with open ('unparsed', 'a') as f:
                f.write(error+'\n')
            # raise Exception("unmatched token(s) '%s' in '%s'"%(error, prereqs))
        elif course:
            course = course.strip()
            course_prefix = '%s '%depts[course].upper()
        elif number:
            print(course_prefix+number)

