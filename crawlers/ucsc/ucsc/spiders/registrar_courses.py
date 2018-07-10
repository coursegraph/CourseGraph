# -*- coding: utf-8 -*-
import scrapy


class RegistrarCoursesSpider(scrapy.Spider):
    name = 'registrar_courses'
    allowed_domains = ['http://registrar.ucsc.edu/']
    start_urls = ['http://registrar.ucsc.edu/catalog/programs-courses/index.html/']

    def parse(self, response):
        pass
