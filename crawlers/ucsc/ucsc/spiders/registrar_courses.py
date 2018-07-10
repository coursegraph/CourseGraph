# -*- coding: utf-8 -*-
import scrapy


class RegistrarCoursesSpider(scrapy.Spider):
    name = 'registrar_courses'
    allowed_domains = ['registrar.ucsc.edu']
    start_urls = ['https://registrar.ucsc.edu/catalog/programs-courses/index.html']

    def parse(self, response):
    	# Get links to all course pages from the registrar
        page_content = response\
        	.xpath('body/div[@id="wrap"]/div[@id="container"]/div[@id="content"]')\
        	.xpath('div[@id="sprflt"]/div[@id="main"]/div[contains(@class,"content")]')
        panel_elems = page_content.xpath('table/tbody/tr/td')
        for panel in panel_elems:
        	program_statements = panel.xpath('p/a')
        	for a in program_statements:
        		# print(a.xpath('@href').extract())
        		dept = a.xpath('@href').re(r'program-statements/(\w+)\.html')[0]
        		title = a.xpath('text()').extract()[0]
        		course_url  = 'https://registrar.ucsc.edu/catalog/programs-courses/course-descriptions/%s.html'%dept
        		program_url = 'https://registrar.ucsc.edu/catalog/programs-courses/program-statements/%s.html'%dept
        		faculty_url = 'https://registrar.ucsc.edu/catalog/programs-courses/faculty/%s.html'%dept
        		yield scrapy.Request(course_url, callback=self.parse_course_info)
        		yield scrapy.Request(program_url, callback=self.parse_program_info)
        		yield scrapy.Request(faculty_url, callback=self.parse_faculty_info)

    def parse_course_info (self, response):
    	print("Got %s"%response.url)

    def parse_program_info (self, response):
    	print("Got %s"%response.url)

    def parse_faculty_info (self, response):
    	print("Got %s"%response.url)
