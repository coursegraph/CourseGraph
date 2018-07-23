import re
from fetch_index import fetch_soup, enforce
from fetch_course_pages import fetch_course_pages


def parse_course (s, division=None):
    return s, None

def parse_division (s):
    match = re.match(r'DIVISION\s+([A-Z][a-z]+(?:\-[A-Z][a-z]+)*)\s*\n', s)
    enforce(match, "Expected 'DIVISION <div name>\\n', not\n%s"%s.split('\n')[0])
    division = match.group(1)
    s = s[match.end():]

    courses = []
    while s:
        s, result = parse_course(s, division=division)
        if result:
            courses.append(result)
        else:
            break
    return s, courses


def parse_course_page (page):
    text = page.content
    courses = []
    while text:
        text, result = parse_division(text)
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
