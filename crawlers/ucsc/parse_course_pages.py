import re
from fetch_index import fetch_soup, enforce
from fetch_course_pages import fetch_course_pages

def parse_course_page (page):
    state = { 'section': None }
    text = page.content
    dept = page.dept.upper()
    courses = {}

    def parse_section (s):
        match = re.match(r'^\s*([A-Z][a-z]+(?:\-[A-Z][a-z]+))\s+Courses', s)
        if match:
            state['section'] = match.group(1).strip()
            print("Set section '%s'"%state['section'])
            return s[match.end():], True
        return s, False 

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
        parse_section,
        parse_course
    ]
    def try_parse (text):
        for stage in stages:
            text, parsed = stage(text)
            if parsed:
                return text, True
        return text, False

    while len(text) > 0:
        text, parsed = try_parse(text)
        enforce(parsed, "Could not parse: %s", text)




if __name__ == '__main__':
    map(parse_course_page, fetch_course_pages())
