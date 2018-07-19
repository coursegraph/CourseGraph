from bs4 import BeautifulSoup
from urllib2 import urlopen
from pprint import pprint
import re

def fetch_html (url, process_callback):
    response = urlopen(url)
    return process_callback(BeautifulSoup(response.read(), 'html.parser'))


def enforce (condition, msg, *args):
    if not condition:
        raise Exception(msg % args)


def process_registrar_page_content (url, callback):
    def process (soup):
        top = soup.find(id='top')
        enforce(top, "Could not find 'top' element in page at '%s':%s",
            url, soup.prettify())
        content = top.parent.parent
        enforce('content' in content['class'],
            "Expected #top to be nested within <div class='content'><p><a id='top' /><p>...</div>, not\n%s",
            content.prettify() if content else '', soup.prettify())
        return callback(content)
    return fetch_html(url, process)

def filterMapRegex (items, regex, groups = (1)):
    for item in items:
        match = re.match(regex, item)
        if match:
            yield match.group(*groups)

def process_registrar_course_page (dept):
    dept = dept.upper()
    prefix = dept + ' '
    courses = {}
    def parse_course (name, text):
        items = text.split('.')
        courses[name] = { 'dept': dept }
        if len(items) > 0:
            courses[name]['title'] = items[0]
            items = items[1:]
        if len(items) > 0:
            match = re.match(r'\s*([FWS](?:,[FWS])*|\*)\s+', items[0])
            enforce(match, "Could not match terms in '%s'", items[0])
            courses[name]['terms'] = match.group(1).replace(',','')
            courses[name]['instructor'] = items[-1]
            items = items[:-1]
        if len(items) > 0:
            courses[name]['description'] = '.'.join(items)

    def process (content):
        text = content.text
        text = re.sub(r'\.([\)"]+)', r'\1.', text)
        items = filterMapRegex(text.split('\n'),
            r'(\d+[A-Z]?)\.\s+([^\n]+)', (1, 2))
        for courseId, rest in items:
            parse_course(prefix + courseId, rest)
        return courses
    return process

if __name__ == '__main__':
    result = process_registrar_page_content(
        'https://registrar.ucsc.edu/catalog/archive/17-18/programs-courses/course-descriptions/math.html',
        process_registrar_course_page('math'))

    pprint(result)
