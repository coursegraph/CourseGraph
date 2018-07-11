# -*- coding: utf-8 -*-
import scrapy
import os


def path_components (path):
    if '://' in path:
        path = path.split('://')[1]
    parts = path.split('/')
    while parts and parts[0] == '':
        parts = parts[1:]
    while parts and parts[-1] == '':
        parts = parts[:-1]
    return parts

assert(path_components('') == [])
assert(path_components('/') == [])
assert(path_components('foo/') == ['foo'])
assert(path_components('/bar') == ['bar'])
assert(path_components('foo/bar') == ['foo','bar'])

def merge_url (url, rel):
    # note: blame seiji for all the issues with this code
    thing = url.split('://')[0] if '://' in url else 'https' 
    if url and url[-1] == '/':
        url = path_components(url)
    else:
        url = path_components(url)[:-1]

    for part in path_components(rel):
        if part == '..':
            url = url[:-1]
        else:
            url.append(part)
    return thing + '://' + '/'.join(url)

assert(merge_url('https://registrar.ucsc.edu/catalog/programs-courses/index.html', 
    '../foo/bar/../baz.html') == 'https://registrar.ucsc.edu/catalog/foo/baz.html')
assert(merge_url('', 'bar.baz') == 'https://bar.baz')
assert(merge_url('https://foo/bar/baz.html', '') == 'https://foo/bar')

registrar_base_url = 'https://registrar.ucsc.edu/catalog/programs-courses'
base_course_description_url = 'https://registrar.ucsc.edu/catalog/programs-courses/course-descriptions'
base_faculty_url = 'https://registrar.ucsc.edu/catalog/programs-courses/faculty'
base_program_description_url = 'https://registrar.ucsc.edu/catalog/programs-courses/program-statements'

class RegistrarCoursesSpider(scrapy.Spider):
    name = 'registrar_courses'
    allowed_domains = ['registrar.ucsc.edu']
    start_urls = [merge_url(registrar_base_url, 'index.html')]

    def __init__(self, *args, **kwargs):
        super(RegistrarCoursesSpider, self).__init__(*args, **kwargs)
        self.crawled = set()

    def parse (self, response):
        print("Parsing %s"%response.url)

        if base_course_description_url in response.url:
            self.parse_course_info(response)
        elif base_faculty_url in response.url:
            self.parse_faculty_info(response)
        elif base_program_description_url in response.url:
            self.parse_program_info(response)

        all_links = response.xpath('//a')
        for link in all_links:
            #print("Got link: %s"%link.extract())
            try:
                href = link.xpath('@href').extract()[0]

                def is_local_url (url):
                    for thing in ('http:','https:','C:','www','ucsc.edu'):
                        if thing in url:
                            return False
                    return True

                url = merge_url(response.url, href) if is_local_url(href) else href
                if url in self.crawled:
                    continue
                #print("Got URL: %s"%url)
                self.crawled.add(url)
                if registrar_base_url in url:
                    yield { 'url': url }
                    yield scrapy.Request(url, self.parse)
                else:
                    pass
                    #print("Skipping %s"%url)
            except IndexError:
                pass

    def parse_course_info (self, response):
        print("Got %s"%response.url)

    def parse_faculty_info (self, response):
        print("Got %s"%response.url)

    def parse_program_info (self, response):
        print("Got %s"%response.url)



class Unused:
    def parse(self, response):
        # Get links to all course pages from the registrar
        page_content = response\
            .xpath('body/div[@id="wrap"]/div[@id="container"]/div[@id="content"]')\
            .xpath('div[@id="sprflt"]/div[@id="main"]/div[contains(@class,"content")]')
        panel_elems = page_content.xpath('table/tbody/tr/td')

        self.depts = {}
        self.crawled = set()
        for panel in panel_elems:
            program_statements = panel.xpath('p/a')
            for a in program_statements:
                # print(a.xpath('@href').extract())
                dept = a.xpath('@href').re(r'program-statements/(\w+)\.html')[0]
                title = a.xpath('text()').extract()[0]
                url = 'https://registrar.ucsc.edu/catalog/programs-courses/program-statements/%s.html'%dept
                self.depts[dept] = title
                self.crawled.add(url)
                yield scrapy.Request(url, callback=self.parse_program_info)
                #course_url  = 'https://registrar.ucsc.edu/catalog/programs-courses/course-descriptions/%s.html'%dept
                program_url = 'https://registrar.ucsc.edu/catalog/programs-courses/program-statements/%s.html'%dept
                faculty_url = 'https://registrar.ucsc.edu/catalog/programs-courses/faculty/%s.html'%dept
                #yield scrapy.Request(course_url, callback=self.parse_course_info)
                yield scrapy.Request(program_url, callback=self.parse_program_info)
                yield scrapy.Request(faculty_url, callback=self.parse_faculty_info)

    def parse_program_info (self, response):
        page_content = response\
            .xpath('body/div[@id="wrap"]/div[@id="container"]/div[@id="content"]')\
            .xpath('div[@id="sprflt"]/div[@id="main"]/div[contains(@class,"content")]')

        page_links = page_content.xpath('p[3]/a')
        for a in page_links:
            href, regex = a.xpath('@href'), r'\.\./([\w\-]+/\w+\.html)'
            try:
                page = href.re(regex)[0]
                title = a.xpath('text()').extract()[0]
                url = 'https://registrar.ucsc.edu/catalog/programs-courses/program-statements/%s'%page
                print("\n%s: %s"%(url, title))
            except IndexError:
                print("Could not match '%s' with '%s'"%(href, regex))
        content = page_content
        #print("%s"%content.extract()[0])

    def parse_course_info (self, response):
        print("Got %s"%response.url)

    def parse_faculty_info (self, response):
        print("Got %s"%response.url)
