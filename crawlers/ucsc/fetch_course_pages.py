import re
from urllib2 import urlopen, HTTPError
from bs4 import BeautifulSoup
from fetch_index import fetch_soup, enforce, fetch_department_urls


def fetch_dept_page_content (url):
    try:
        soup = fetch_soup(url)  
        content = soup.find("div", {"class": "content"})
        text = content.text.encode('ascii', 'ignore').strip()
        text = text.split("* Not offered in")[0]
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if 'Program Statement' in line:
                # print(line)
                while not lines[i+1].strip():
                    i += 1
                # print(lines[i+1])
                break
        if i + 1 >= len(lines):
            # print("Skipping '%s'", url)
            return
        text = '\n'.join(lines[i+1:]).strip()
        enforce(text, "Empty page content: '%s'\nRaw content:\n%s", url, content.text.encode('ascii', 'ignore'))
        return text

    except HTTPError:
        print("Failed to open department page '%s'"%url)
        return None

class DepartmentPageEntry:
    def __init__ (self, dept, title, url, content):
        self.dept = dept.strip()
        self.title = title.encode('ascii', 'ignore').strip()
        self.url = url.encode('ascii', 'ignore').strip()
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
            f.write(dept.content)

if __name__ == '__main__':
    dump_department_pages_to_disk('data')
    # dept_urls = fetch_department_urls()
    # print("Got %s"%dept_urls)
    # for dept in fetch_department_course_pages():
    #     print(dept)
    #     print(dept.content)
    #     print()