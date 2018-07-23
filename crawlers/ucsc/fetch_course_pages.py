import re
from urllib2 import urlopen, HTTPError
from bs4 import BeautifulSoup
from fetch_index import fetch_soup, enforce, fetch_department_urls


def extract_text (element):
    if element.name == 'p':
        return '\n%s\n'%(''.join(map(extract_text, element)))
    elif element.name == 'br':
        return '\n'
    elif element.name is None:
        return '%s'%element
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

    text = ''
    for k, v in divisions.iteritems():
        text += 'DIVISION %s%s'%(k, v)
    return text

def fetch_dept_page_content (url):
    try:
        soup = fetch_soup(url)  
        content = soup.find("div", {"class": "content"})
        text = extract_sections(content)
        enforce(text, "Empty page content: '%s'\nRaw content:\n%s", url, content.text)
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

    for title, url in dept_urls.iteritems():
        page = url.split('/')[-1]
        dept = page.split('.')[0]
        url = '%s/course-descriptions/%s'%(base_url, page)
        print("Fetching '%s' => '%s'"%(title, url))
        result = fetch_dept_page_content(url)
        if result:
            yield DepartmentPageEntry(dept, title, url, result)


def dump_department_pages_to_disk (path, base_url = 'https://registrar.ucsc.edu/catalog/programs-courses', dept_urls = None):
    for dept in fetch_department_course_pages(base_url, dept_urls):
        with open('%s/courses/%s'%(path, dept.dept), 'w') as f:
            f.write(dept.content.encode('utf8'))

if __name__ == '__main__':
    dump_department_pages_to_disk('data')
    # dept_urls = fetch_department_urls()
    # print("Got %s"%dept_urls)
    # for dept in fetch_department_course_pages():
    #     print(dept)
    #     print(dept.content)
    #     print()