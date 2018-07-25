# -*- coding: utf-8 -*-
import scrapy


class RmpUcscSpider(scrapy.Spider):
    name = 'rmp-ucsc'
    allowed_domains = ['http://www.ratemyprofessors.com/search.jsp?queryBy=schoolId&schoolName=University+of+California+Santa+Cruz&schoolID=1078&queryoption=TEACHER']
    start_urls = ['http://http://www.ratemyprofessors.com/search.jsp?queryBy=schoolId&schoolName=University+of+California+Santa+Cruz&schoolID=1078&queryoption=TEACHER/']

    def parse(self, response):
        pass
