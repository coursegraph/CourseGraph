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

def get_catalog_course_pages (base_url):
    index_url = '%s/front/courses.html'%base_url
    def process (soup):
        courses = {}
        href_regex = re.compile(r'\.\./(courses/([^\.]+)\.html)')
        for a in soup.find_all('a'):
            if 'href' in a.attrs and 'title' in a.attrs:
                match = re.match(href_regex, a.attrs['href'])
                if match:
                    url, dept = match.group(1, 2)
                    url = '%s/%s'%(base_url, url)
                    title = a.attrs['title']
                    courses[dept] = { 'url': url, 'title': title }
        return courses
    return fetch_html(index_url, process)

def get_page_courses (dept, item):
    dept_lower = dept.lower()
    course_regex = re.compile(r'([a-z]+)(\d+[a-z]?)')

    def getSiblingTextUntilNextAnchor (a):
        text = ''
        x = a.next
        while x and x.name != 'a':
            try:
                text += x
            except TypeError:
                pass
            x = x.next
        return text

    def process_course (name, title, descr):
        if not name or len(name) == 0:
            enforce(not title and not descr, "Empty name '%s' for '%s', '%s'", name, title, descr)
            return

        # if '/' in name: # handle eg. "BIMM/CSE/ETC 187B"
        #     depts, number = name.split(' ')
        #     if '/' in depts:
        #         for d in depts.split('/'):
        #             process_course('%s %s'%(d, number), title, descr)
        #     elif '/' in number:
        #         for n in number.split('/'):
        #             if not n.isnumeric():
        #                 continue
        #             process_course('%s %s'%(depts, n), title, descr)
        #     return

        # if not re.match(r'[A-Z][A-Za-z]+\s+\d+[A-Z]*', name):
        #     raise Exception("Invalid course name: '%s'", name)
        print('\t'+name)
        print('\t'+title)
        print('\t'+descr)

    def process (soup):
        for a in soup.find_all('a'):
            try:
                match = re.match(course_regex, a.attrs['id'])
                if not match:
                    continue
                text = getSiblingTextUntilNextAnchor(a).strip()
                # print(text)
                if '\n' in text:
                    items = text.split('\n')
                    header = items[0].strip()
                    descrip = items[1].strip()
                    # descrip = '\n'.join(items[1:]).strip()
                else:
                    header, descrip = text.strip(), ''
                print(header)
                if '.' in header:
                    items = header.split('.')
                    name = items[0].strip()
                    rest = '.'.join(items[1:]).strip()
                else:
                    name, rest = header, ''
                process_course(name, rest, descrip)                
            except KeyError:
                continue
    return fetch_html(item['url'], process)

if __name__ == '__main__':
    course_pages = get_catalog_course_pages('http://ucsd.edu/catalog')
    for k, x in course_pages.iteritems():
        get_page_courses(k, x)
    # get_page_courses(course_pages)
    # pprint(course_pages)
