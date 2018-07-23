import re
from fetch_index import fetch_soup, enforce
from fetch_course_pages import fetch_department_course_pages

def parse_course_page (page):
    state = { 'section': None }
    text = page.content

    def parse_section (s):
        match = re.match(r'^\s*([A-Z][a-z]+(?:\-[A-Z][a-z]+))\s+Courses', s)
        if match:
            state['section'] = match.group(1).strip()
            print("Set section '%s'"%state['section'])
            return s[match.end():], True
        return s, False 

    stages = [
        parse_section,
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
    map(parse_course_page, fetch_department_course_pages())
