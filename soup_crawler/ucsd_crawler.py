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
        # print('\t'+name)
        # print('\t'+title)
        # print('\t'+descr)
        hits = descr.split("Prerequisites:")
        prereqs = ". ".join(hits[1:]).strip().strip('.')
        descr = hits[0]
        # print(descr)

        prereq_requirements = set()
        def requirement (*reqs):
            def sub (stuff):
                for req in reqs:
                    prereq_requirements.add(req)
                return ''
            return sub

        def course_case_multiple_and (match):
            print("AND case:")
            print(match.group(1, 2, 3))

        def course_case_single (match):
            print("SINGLE CASE: '%s' '%s'"%match.group(1, 2))

        def course_case_concatenative_or (match):
            print("OR CONCATENATIVE CASE: '%s' '%s'"%match.group(1, 2))

        def course_case_concatenative_and (match):
            print("AND CONCATENATIVE CASE: '%s' '%s'"%match.group(1, 2))

        def parse_annoying_edge_case (match):
            dept, course, suffixes = match.group(1, 2, 3)
            match = re.match(r'(\d+)([A-Z\-]+)', course)
            enforce(match, "Course invalid - something broke...? dept = '%s', course = '%s', suffixes = '%s'",
                dept, course, suffixes)
            prefix, suffix = match.group(1, 2)
            suffixes = suffixes.strip().split()
            print("PARSED ANNOYING EDGE CASE: dept, prefix = '%s', '%s'; suffixes = '%s', %s"%(
                dept, prefix, suffix, suffixes))

        def parse_fucking_ridiculous_everything_case (match):
            print("GOT RIDICULOUS CASE: '%s' '%s'"%(match.group(1), match.group(2)))

        replace_cases = [
            (r'none', ''),
            (r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]+)\s+((\d+[A-Z\-]*)(\s+(and|or)\s+[A-Z])+)(?:\s+|$)', parse_annoying_edge_case),
            # (r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]+)\s+(\d+[A-Z\-]*)', course_case_single),
            # (r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]+)\s+(\d+[A-Z\-]*(?:\s+or\s+\d+[A-Z\-]*)*)', course_case_concatenative_or),
            # (r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]+)\s+(\d+[A-Z\-]*(?:\s+and\s+\d+[A-Z\-]*)*)', course_case_concatenative_and),
            (r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]+)\s+((?:\d+[A-Z\-]*(?:,\s+|,?\s+(?:or|and)\s+))*\d+[A-Z\-]*)', parse_fucking_ridiculous_everything_case),
            # (r'([A-Z]\w+) ((\d\w+), )or (\d+\w+)', course_case_multiple_or),
            
            (r'(graduate standing( required)?|for graduate students|graduate student status)', requirement('GRADUATE_STANDING')),
            (r'(Undergraduates must be seniors)', requirement('SENIOR_STANDING')),
            (r'upper-division standing( required)?', requirement('UPPER_DIVISION_STANDING')),
            (r'lower-division standing( required)?', requirement('LOWER_DIVISION_STANDING')),
            (r'completion of college writing', requirement('COMPLETED_COLLEGE_WRITING')),
            (r'admission to the MAS Clinical Research Program', requirement("ADMITTED_MAS_CLINICAL_RESEARCH_PROGRAM")),
            (r'admission to (the )?MFA theatre program', requirement("ADMITTED_MFA_THEATRE_PROGRAM")),
            (r'admission to PhD program in theatre', requirement("ADMITTED_PHD_THEATRE_PROGRAM")),
            (r'Enrollment restricted to biological sciences graduate students', requirement("GRADUATE_STANDING", "BIOLOGICAL_SCIENCES_STUDENTS_ONLY")),
            (r'limited to BMS graduate students except by consent of instructor', requirement("GRADUATE_STANDING", "BMS_STUDENTS_ONLY", "INSTRUCTOR_CONSENT")),
            (r'second- or third-year design students only', requirement("SOPHOMORE_STANDING", "JUNIOR_STANDING", "DESIGN_STUDENTS_ONLY")),
            (r'consent of instruct(or)?', requirement('INSTRUCTOR_CONSENT')),
            (r'(consent of department|department approval( required)?)', requirement('DEPARTMENT_CONSENT')),
            (r'grade of C\- or better in ', ''),
            (r'\([FWS](,[FWS])*\)', ''),
            # (r'^\s*((and|or|[,;\.|])\s*)+$', ''),
        ]
        if prereqs:
            print(prereqs)
            for r, s in replace_cases:
                prereqs = re.sub(r, s, prereqs).strip()
            # if prereqs:
            print("\t'%s'"%prereqs)

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
                # print(header)
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
