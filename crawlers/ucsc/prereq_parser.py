import re

tokenizer = re.compile(r'''
    (course|(?:[A-Z][a-z]+(?:\s+and)?)*\s+[A-Z][a-z]+) |
    (\d+[A-Z]?) |
    (;\s+and\s+) |
    (;\s+or\s+) |
    (;\s+) |
    (,\s+and\s+) |
    (,\s+or\s+) |
    (,\s+) |
    (and) |
    (or) |
    (\s+) |
    (.+)
''', re.DOTALL | re.VERBOSE)

def parse_prereqs (prereqs, dept, depts):
    print("Parsing '%s'"%prereqs)
    depts['course'] = dept
    course_prefix = "N/A "
    for match in re.finditer(tokenizer, prereqs):
        (course, number, 
            semi_and, semi_or, semi, 
            comma_and, comma_or, comma,
            _and, _or,
            whitespace,
            error
        ) = match.groups()
        if error:
            with open ('unparsed', 'a') as f:
                f.write(error+'\n')
        elif course:
            course = course.strip()
            course_prefix = '%s '%depts[course].upper()
        elif number:
            print(course_prefix+number)
