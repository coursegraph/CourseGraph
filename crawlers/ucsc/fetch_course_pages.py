#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
from bs4 import BeautifulSoup
from urllib.request import HTTPError
from fetch_index import fetch_soup, enforce, fetch_department_urls
import os

def extract_text (element):
    if element.name == 'p':
        return '\n%s\n'%(u''.join(map(extract_text, element)))
    elif element.name == 'div':
        return '\n%s\n'%(u''.join(map(extract_text, element)))
    elif element.name == 'br':
        return '\n'
    elif element.name is None:
        return ('%s'%element)
    else:
        return element.text

def extract_sections (content):
    divisions = {}
    text = ''
    division = None
    for child in content:
        if child.name == 'h1' or child.name == 'h2' or child.name == 'h3' or child.name == 'h4':
            match = re.match(r'^\s*([A-Z][a-z]+(?:\-[A-Z][a-z]+)*)\s+Courses', child.text)
            enforce(match, "Expected header to be course heading, got '%s'", child.text)
            if division:
                divisions[division] = text
                text = ''
            division = match.group(1)
            # print("Setting division: '%s'"%division)
        elif division:
            if child.name == 'p':
                try:
                    test = child['align']
                    continue
                except KeyError:
                    pass
            text += extract_text(child)
    if division:
        divisions[division] = text

    print("Listed Divisions: %s"%divisions.keys())

    text = ''
    for k, v in divisions.items():
        text += '\nDIVISION %s\n%s'%(k, v)
    return text

def fetch_dept_page_content (url):
    try:
        soup = fetch_soup(url)  
        content = soup.find("div", {"class": "content"})
        text = extract_sections(content)
        enforce(text, "Empty page content: '%s'\nRaw content:\n%s", url, content.text)
        text = text.replace('\\n', '')
        text = '\n'.join([ line.strip() for line in text.split('\n') ])
        return text
    except HTTPError:
        print("Failed to open department page '%s'"%url)
        return None

class DepartmentPageEntry:
    def __init__ (self, dept, title, url, content):
        self.dept = dept.strip()
        self.title = title.strip()
        self.url = url.strip()
        self.content = content

    def __repr__ (self):
        return '''[Department %s title '%s' url '%s' content (%d byte(s))'''%(
            self.dept, self.title, self.url, len(self.content))

def fetch_department_course_pages (base_url = 'https://registrar.ucsc.edu/catalog/programs-courses', dept_urls = None):
    if not dept_urls:
        dept_urls = fetch_department_urls(base_url)
        enforce(dept_urls, "Could not fetch department urls from index at base url '%s'", base_url)

    for title, url in dept_urls.items():
        page = url.split(u'/')[-1]
        dept = page.split(u'.')[0]
        url = u'%s/course-descriptions/%s'%(base_url, page)
        print("Fetching '%s' => '%s'"%(title, url))
        result = fetch_dept_page_content(url)
        if result:
            yield DepartmentPageEntry(dept, title, url, result)

def dump_department_pages_to_disk (path='data', base_url = 'https://registrar.ucsc.edu/catalog/programs-courses', dept_urls = None):
    for dept in fetch_department_course_pages(base_url, dept_urls):
        with open('%s/courses/%s'%(path, dept.dept), 'w') as f:
            f.write(u'\n'.join([
                dept.dept,
                dept.title,
                dept.url,
                dept.content
            ]))

def fetch_courses_from_disk (path='data'):
    for filename in os.listdir(u'%s/courses/'%path):
        with open(u'%s/courses/%s'%(path, filename), 'r') as f:
            lines = f.read().split('\n')
            result = DepartmentPageEntry(
                lines[0], 
                lines[1], 
                lines[2],
                '\n'.join(lines[3:]))
            print("Loaded %s: '%s', %s byte(s)"%(
                result.dept, result.title, len(result.content)))
            yield result

def fetch_course_pages (*args, **kwargs):
    courses = list(fetch_courses_from_disk(*args, **kwargs))
    if not courses:
        print("No disk cache; refetching")
        return fetch_department_course_pages(*args, **kwargs)
    return courses


if __name__ == '__main__':
    dump_department_pages_to_disk('data')
    # dept_urls = fetch_department_urls()
    # print("Got %s"%dept_urls)
    # for dept in fetch_department_course_pages():
    #     print(dept)
    #     print(dept.content)
    #     print()