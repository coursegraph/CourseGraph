#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
from bs4 import BeautifulSoup, Comment
from urllib.request import HTTPError
from fetch_index import fetch_soup, enforce, fetch_department_urls
import os

def extract_text (element):
    # this is REALLY f***ing ugly...
    if isinstance(element, Comment):
        return ''
    elif element.name == 'p':
        return '\n%s\n'%(u''.join(map(extract_text, element)))
    elif element.name == 'div':
        return '\n%s\n'%(u''.join(map(extract_text, element)))
    elif element.name == 'br':
        return '\n'
    elif element.name == 'strong':
        # This probably deserves some explaination. Ok, issues are as follows:
        #  – some idiot put a line break to separate stuff-that-should-be-separated in lgst.
        #    line break / paragraph element doesn't show up elsewhere, so we have to catch + 
        #    address it here.
        #  - some other idiot put a line break in anthropology, separating a title that
        #    SHOULDN'T be separated
        #
        # So, we do the following:
        #  – we manually concatenate all of the inner text tags (b/c no way to do this otherwise)
        #  - if non-empty text is followed by a line break, we emit a '\n' afterwards
        #  - if not we don't, b/c there shouldn't be any good reason to put a <br /> inside of a 
        #    strong tag given what the registrar page is supposed to look like...
        text = ''
        has_non_internal_line_break = False
        for child in element:
            if child.name == 'br':
                has_non_internal_line_break = True
            elif child.name == None:
                text += child
                has_non_internal_line_break = False
        return text + '\n' if has_non_internal_line_break else text
    elif element.name is None:
        return '%s'%element
    elif element.name == 'comment':
        raise Exception("Skipping comment %s"%element.text)
    else:
        return element.text

def extract_sections (content, dept):
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
    
    # THIS IS A TERRIBLE HACK.
    # Problem: the sociology page's intro course is missing a course number.
    # Solution: this.
    # This will break (hopefully) whenever the sociology fixes that page.
    # Until then, uh...
    if dept == 'socy':
        divisions['Lower-Division'] = '1. '+divisions['Lower-Division']
    
    for k, v in divisions.items():
        text += '\nDIVISION %s\n%s'%(k, v)
    return text

def fetch_dept_page_content (url):
    try:
        soup = fetch_soup(url)  
        content = soup.find("div", {"class": "content"})
        text = extract_sections(content, url.split('/')[-1].split('.')[0])
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