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
            pass
            # print("GOT RIDICULOUS CASE: '%s' '%s'"%(match.group(1), match.group(2)))

        replace_cases = [
            (r'none', ''),
            (r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]+)\s+((\d+[A-Z\-/]*)(\s+(and|or)\s+[A-Z])+)(?:\s+|$)', parse_annoying_edge_case),
            # (r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]+)\s+(\d+[A-Z\-]*)', course_case_single),
            # (r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]+)\s+(\d+[A-Z\-]*(?:\s+or\s+\d+[A-Z\-]*)*)', course_case_concatenative_or),
            # (r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]+)\s+(\d+[A-Z\-]*(?:\s+and\s+\d+[A-Z\-]*)*)', course_case_concatenative_and),
            (r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]+)\s+((?:\d+[A-Z\-/]*(?:,\s+|,?\s+(?:or|and)\s+))*\d+[A-Z\-/]*)', parse_fucking_ridiculous_everything_case),
            # (r'([A-Z]\w+) ((\d\w+), )or (\d+\w+)', course_case_multiple_or),
            
            (r'[Ll]imited to BMS graduate students except by consent of instructor', requirement("GRADUATE_STANDING", "BMS_STUDENTS_ONLY", "INSTRUCTOR_APPROVAL")),
            (r'[Ll]imited to senior undergraduates, graduate students, and medical students', requirement('GRADUATE_STANDING', 'SENIOR_STANDING', 'MEDICAL_STUDENT')),
            (r'in bioengineering', requirement('BIOENGINEERING_MAJOR')),
            (r'in bioengineering', requirement('SOCIOLOGY_MAJOR')),
            (r'biological sciences', requirement("GRADUATE_STANDING", "BIOLOGICAL_SCIENCES_MAJOR")),
            (r'standard undergraduate biology courses', requirement('BICD 1', 'BICD 2', 'BICD 3', 'BICD 4')),
            (r'admission to Skaggs School of Pharmacy and Pharmaceutical Sciences or BMS Program \(major Code BS75\)', requirement('ADMITTED_SKAGGS_SCHOOL', 'BMS_STUDENT')),
            (r'MAS( program| students?)?', requirement('ADMITTED_MAS_CLINICAL_RESEARCH_PROGRAM')),

            (r'completion of college writing', requirement('COMPLETED_COLLEGE_WRITING')),
            (r'admission to the MAS Clinical Research Program', requirement("ADMITTED_MAS_CLINICAL_RESEARCH_PROGRAM")),
            (r'admission to (the )?MFA theatre program', requirement("ADMITTED_MFA_THEATRE_PROGRAM")),

            (r'PhD', requirement('PHD_STANDING', 'GRADUATE_STANDING')),
            (r'(for )?graduate( students?)?( standing| status)?( required)?', requirement('GRADUATE_STANDING')),
            (r'([Uu]ndergraduates must be )?seniors?( standing)?( required)?', requirement('SENIOR_STANDING')),
            (r'upper.division standing( required)?', requirement('UPPER_DIVISION_STANDING')),
            (r'lower.division standing( required)?', requirement('LOWER_DIVISION_STANDING')),
            (r'first.(year?)', requirement('REQUIRES_FIRST_YEAR_STUDENT')),
            (r'second.(year?)', requirement('REQUIRES_SECOND_YEAR_STUDENT')),
            (r'third.year', requirement('REQUIRES_THIRD_YEAR_STUDENT')),
            (r'transfer standing( required)?', requirement('TRANSFER_STANDING')),
            (r'for transfer students?', requirement('FOR_TRANSFER_STUDENTS')),

            (r'AuD student', requirement("AUD_MAJOR")),
            (r'Economics ', requirement("ECONOMICS_MAJOR")),
            (r'Rady', requirement("RADY_MAJOR")),
            (r'admission to PhD program in theatre', requirement("ADMITTED_PHD_THEATRE_PROGRAM")),
            (r'design students?( only)?', requirement("DESIGN_MAJOR")),
            (r'psychology majors?( only)?', requirement("PSYCHOLOGY_MAJOR")),
            (r'GPS student?( only)?', requirement("GPS_MAJOR")),

            (r'Sixth College (students?)?( only)?', requirement("SIXTH_COLLEGE")),
            (r'Revelle College', requirement("REVELLE_COLLEGE")),

            (r'(consent of (the ))?[Dd]epartment(al)? (stamp|approval|chair)?( required)?', requirement('DEPARTMENT_APPROVAL')),
            (r'(consent of )?[Ii]nstruct(or)?( approval)?', requirement('INSTRUCTOR_APPROVAL')),
            (r'(program approval)', requirement('PROGRAM_APPROVAL')),
            (r'((status or )?consent of graduate program director)', requirement('REQUIRES_GRADUATE_PROGRAM_DIRECTOR_APPROVAL')),

            (r'(by |through )?audition( required)?', requirement('REQUIRES_AUDITION')),
            (r'(upper.division or graduate courses in molecular and cell biology)', requirement('UPPER_DIV_OR_GRADUATE_MCB_COURSES')),
            (r'Restricted to students within the DS25 major', requirement("REQUIRES_DS25_MAJOR")),
            (r'All other students will be allowed as space permits', requirement("OTHER_STUDENTS_ALLOWABLE_AS_SPACE_PERMITS")),
            (r'enrollment in Science Studies Program', requirement("ENROLLED_IN_SCIENCES_STUDY_PROGRAM")),
            (r'Bioengineering or Bioengineering: Biotechnology majors only', requirement("BIOENGINEERING_OR_BIOTECH_MAJORS_ONLY")),
            (r'by invitation only', requirement("BY_INVITATION_ONLY")),
            (r'MDE students only', requirement("MDE_STUDENTS_ONLY")),
            (r'(with a )?grade of [A-Z]+.?( or better)?(, or equivalent)?',''),
            (r'(or enrolled in|the department|or equivalent|(successful )?completion of)', ''),
            (r'(in music)', ''),
            (r'[Ee]nrollment (restricted to|by completion of prerequisites or by)', ''),
            (r'\(S/U grades? (permitted|(option )?only)\.\)', ''),
            (r'\([FWS](,[FWS])*\)', ''),
            (r'^\s*((and|or|for|[,;\.\(\)])\s*)+$', ''),
        ]
        if prereqs:
            original = prereqs
            for r, s in replace_cases:
                prereqs = re.sub(r, s, prereqs).strip()
            if prereqs:
                print(original)
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
