import re
from fetch_index import fetch_soup, enforce
from fetch_course_pages import fetch_course_pages

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
    match = re.search(r'\s*((\([FWS]\)|The Staff|[A-Z]\.|[A-Z][a-z]+(?:.[A-Z])?|m. cardenas)(?:(?:,?\s+)(The Staff|[A-Z]\.|[A-Z][a-z]+(?:.[A-Z])?|\([FWS]\)|m. cardenas))*),?\s*$', s)
    enforce(match, "Expected instructor at end of course description, got '%s'", s)
    return match.group(1), s[:match.start()]

def parse_course (s, dept=None, division=None):
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

    print("COURSE:      %s"%name)
    print("INITIAL:     %s"%description)

    if description:
        instructor, description = parse_instructor_from_description(description)
    else:
        instructor = None

    print("INSTRUCTOR:  %s"%instructor)
    print("DESCRIPTION: %s"%description)
    print()
    # print("=> instructor(s) '%s', description '%s'"%(instructor, description))
    return s, Course(name, title, credits, term, dept, division, description)

def parse_division (s, dept=None):
    match = re.match(r'[\n\s]*DIVISION\s+([A-Z][a-z]+(?:\-[A-Z][a-z]+)*)\s*\n', s)
    fallback = re.match(r'\* Not|<|Students submit petition to sponsoring agency\. May be repeated for credit\. The Staff|\[Return to top\]', s) if not match else None
    enforce(match or fallback, "Expected 'DIVISION <div name>\\n', not\n%s"%last_tok(s))
    if not match:
        return '', []
    division = match.group(1)
    s = s[match.end():]

    courses = []
    while s:
        s, result = parse_course(s, dept=dept, division=division)
        if result:
            courses.append(result)
        else:
            break
    return s, courses

def parse_course_page (page):
    text = page.content
    courses = []
    while text:
        text, result = parse_division(text, dept=page.dept)
        courses += result
    return courses

    division = None
    text = page.content
    dept = page.dept.upper()
    courses = {}

    # def parse_division (s):
    #     if match:
    #         division = match.group(1).strip()
    #         print("Set division '%s'"%division)
    #         return s[match.end():], True
    #     # else:
    #     return s, False 

    def parse_course_id (s):
        match = re.match(r'\s*(\d+[A-Z]?)\.\s+', s)
        if match:
            name = '%s %s'%(dept, match.group(1))
            return s[match.end():], name
        return s, None

    def parse_course_title (s):
        match = re.match(r'([^\.]+)\.\s+', s)
        if match:
            return s[match.end():], match.group(1)
        return s, None

    def parse_course_term (s):
        match = re.match(r'([FWS](?:,[FWS])+|\*)\s+', s)
        if match:
            return s[match.end():], match.group(1)
        return s, None

    def parse_course (s):
        s, name = parse_course_id(s)
        if name:
            s, title = parse_course_title(s)
            enforce(title, "Empty course title: '%s'", name)
            print("Got course %s: '%s'"%(name, title))
            s, term = parse_course_term(s)
            if term:
                print("Got course term '%s'"%term)


            return s, True
        return s, False

    stages = [
        parse_division,
        parse_course
    ]
    def try_parse (text):
        for stage in stages:
            text, parsed = stage(text)
            if parsed:
                return text, True
        return text, False

    print("Got %s"%text)

    while len(text) > 0:
        text, parsed = try_parse(text)
        enforce(parsed, "Could not parse: %s", text)


def parse_course_pages (*args, **kwargs):
    return list(map(parse_course_page, fetch_course_pages(*args, **kwargs)))



if __name__ == '__main__':
    parse_course_pages()
    # print(fetch_course_pages())
    # map(parse_course_page, fetch_course_pages())
