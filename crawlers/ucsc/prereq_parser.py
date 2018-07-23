import re

tokenizer = re.compile(r'''
    (\s+) |
    (by (?:consent|permission) of instructor) |
    (satisfaction of the Entry Level Writing and Composition requirements) |
    ([Bb]asic knowledge of computer programming languages is assumed) |
    (courses?|(?:[A-Z][a-z]+(?:\s+and)?\s+)*[A-Z][a-z]+) |
    (\d+[A-Z]?) |
    ([;,]\s*(?:and|or)?) |
    (and|or) |
    (.+)
''', re.DOTALL | re.VERBOSE)

def parse_prereqs (prereqs, dept, depts):
    print("Parsing '%s'"%prereqs)
    depts['course'] = dept
    depts['courses'] = dept
    course_prefix = "N/A "
    for match in re.finditer(tokenizer, prereqs):
        (whitespace,
            instructor_consent, writing_req, programming_req,
            course, number,
            delims,
            and_or,
            error
        ) = match.groups()
        if error:
            with open ('unparsed', 'a') as f:
                f.write(error+'\n')
            # raise Exception("unmatched token(s) '%s' in '%s'"%(error, prereqs))
        elif course:
            course = course.strip()
            try:
                course_prefix = '%s '%depts[course].upper()
            except KeyError:
                print("Unhandled course: '%s'"%course)
        elif number:
            print(course_prefix+number)

