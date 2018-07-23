import re
from fetch_index import fetch_soup, enforce
from fetch_course_pages import fetch_course_pages
from prereq_parser import parse_prereqs


class Course:
    def __init__ (self, name, title, credits, term, dept, division, description):
        self.name = name
        self.title = title
        self.credits = credits
        self.term = term
        self.dept = dept
        self.division = division
        self.description = description

def last_tok (s):
    return s.split('\n')[0] if s[0] != '\n' else '\\n%s'%(s.split('\n')[0])

def parse_course_title_and_credits (s):
    match = re.match(r'((?:[A-Z]|[234]D\s+|A Li|I C)[\w/\-,:\(\)\\\'\d–]+(?:(?:\.\.\.|[ \t]+)(?:vs\.|4\.5|Ph\.D\.|U\.S\.|C\.|A\.|[&\+\(\)\w/\-,:!\d–"\\\'])+)*)(?:\s+\((\d+) credits?\))?\.*[ \t]*', s)
    enforce(match, "Expected course title + credit(s), got '%s'"%last_tok(s))
    s = s[match.end():]
    title = match.group(1).strip()
    credits = match.group(2)
    credits = int(credits) if credits else -1
    return s, title, credits

def parse_course_term (s):
    match = re.match(r'([FWS](?:,[FWS])*|\*+)\n', s)
    fallback = re.match(r'\n', s) if not match else None
    enforce(match or fallback, "Expected course term, got '%s'"%last_tok(s))
    if match:
        return s[match.end():], match.group(1)
    else:
        return s[fallback.end():], None    

def parse_course_description (s):
    match = re.match(r'\n*([A-Z"][^\n]+)(?:\n+|$)', s)
    fallback = re.match(r'\n+', s)
    enforce(match or fallback, "Expected course description, got '%s'"%last_tok(s))
    if match:
        return s[match.end():], match.group(1)
    else:
        return s[fallback.end():], None

def parse_instructor_from_description (s):
    if not s:
        return s, None
    match = re.search(r'\s*((\([FWS]\)|The Staff|[A-Z]\.|[A-Z][a-z]+(?:.[A-Z])?|m. cardenas)(?:(?:,?\s+)(The Staff|[A-Z]\.|[A-Z][a-z]+(?:.[A-Z])?|\([FWS]\)|m. cardenas))*),?\s*$', s)
    enforce(match, "Expected instructor at end of course description, got '%s'", s)
    return match.group(1), s[:match.start()]

# def parse_prereqs (prereqs):
#     with open('prereqs', 'a') as f:
#         f.write(prereqs+'\n')
#     return

#     if 'enrollment' in prereqs:
#         print("Enrollment restriction: '%s'"%prereqs)

#     elif ';' in prereqs:
#         match = re.match(r'(.+;\s+)+(and|or)?\s+(.+)', prereqs)
#         enforce(match, "Could not match ';' case in '%s'"%prereqs)
#     elif ',' in prereqs:
#         match = re.match(r'(.+,\s+)+(and|or)?\s+(.+)', prereqs)
#         enforce(match, "Could not match ',' case in '%s'"%prereqs)

def parse_prereqs_from_description (s, dept, dept_lookup):
    if not s:
        return None
    match = re.search(r'Prerequisite\(?s\)?:\s+([^\.]+)', s)
    if not match:
        # print("No prereqs! in '%s'"%s)
        return None
    prereqs = match.group(1)
    with open('prereqs', 'a') as f:
        f.write(prereqs+'\n')
    return parse_prereqs(prereqs, dept=dept, depts=dept_lookup)

def parse_course (s, dept=None, division=None, dept_lookup=None):
    match = re.match(r'[\n\s]*(\d+[A-Z]?)\.\s+', s)
    if not match:
        return s, None
    s = s[match.end():]
    name = '%s %s'%(dept.upper(), match.group(1))
    s, title, credits = parse_course_title_and_credits(s)
    s, term = parse_course_term(s)
    s, description = parse_course_description(s)
    # print("Got course %s '%s', %s credit(s), %s"%(name, title, credits, term))
    # print("Description: '%s'"%description)

    # print("COURSE:      %s"%name)
    # print("INITIAL:     %s"%description)

    instructor, description = parse_instructor_from_description(description)
    prereqs = parse_prereqs_from_description(description, dept, dept_lookup)


    # print("INSTRUCTOR:  %s"%instructor)
    # print("DESCRIPTION: %s"%description)
    # print()
    # print("=> instructor(s) '%s', description '%s'"%(instructor, description))
    return s, Course(name, title, credits, term, dept, division, description)

def parse_division (s, dept=None, dept_lookup=None):
    match = re.match(r'[\n\s]*DIVISION\s+([A-Z][a-z]+(?:\-[A-Z][a-z]+)*)\s*\n', s)
    fallback = re.match(r'\* Not|<|Students submit petition to sponsoring agency\. May be repeated for credit\. The Staff|\[Return to top\]', s) if not match else None
    enforce(match or fallback, "Expected 'DIVISION <div name>\\n', not\n%s"%last_tok(s))
    if not match:
        return '', []
    division = match.group(1)
    s = s[match.end():]

    courses = []
    while s:
        s, result = parse_course(s, dept=dept, division=division, dept_lookup=dept_lookup)
        if result:
            courses.append(result)
        else:
            break
    return s, courses

def parse_course_page (page, dept_lookup):
    text = page.content
    courses = []
    while text:
        text, result = parse_division(text, dept=page.dept, dept_lookup=dept_lookup)
        if result:
            print("Parsed %s courses from %s (%s)"%(len(result), page.dept, result[0].division))
        courses += result
    return courses

def fixup_course_lookup (lookup):
    lookup['Chemistry'] = lookup['Chemistry and Biochemistry']

def parse_course_pages (*args, **kwargs):
    pages = list(fetch_course_pages(*args, **kwargs))
    dept_lookup = {}
    for page in pages:
        dept_lookup[page.title] = page.dept
    fixup_course_lookup(dept_lookup)

    print("Dept lookup:")
    items = sorted(list(dept_lookup.items()), key=lambda x: x[0])
    for i, (title, dept) in enumerate(items):
        print("\t%d\t'%s': '%s'"%(i, title, dept))

    for page in pages:
        for result in parse_course_page(page, dept_lookup=dept_lookup):
            yield result

if __name__ == '__main__':
    with open('prereqs', 'w') as f:
        f.write('')
    with open('unparsed', 'w') as f:
        f.write('')

    courses = list(parse_course_pages())
    print("Parsed %s courses"%len(courses))

    byDept = {}
    byDiv  = {}
    for course in courses:
        if not course.dept in byDept:
            byDept[course.dept] = []
        if not course.division in byDiv:
            byDiv[course.division] = []
        byDept[course.dept].append(course)
        byDiv[course.division].append(course)

    print("Courses by department:")
    for dept, courses in byDept.items():
        print("\t%s: %s course(s)"%(dept, len(courses)))

    print("Courses by division:")
    for div, courses in byDiv.items():
        print("\t%s: %s course(s)"%(div, len(courses)))


    # print(fetch_course_pages())
    # map(parse_course_page, fetch_course_pages())
