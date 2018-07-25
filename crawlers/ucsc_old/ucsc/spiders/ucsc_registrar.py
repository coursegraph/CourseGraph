# -*- coding: utf-8 -*-
import scrapy


class UcscRegistrarSpider(scrapy.Spider):
    name = 'ucsc-registrar'
    allowed_domains = ['https://registrar.ucsc.edu/catalog/programs-courses/']
    start_urls = ['http://https://registrar.ucsc.edu/catalog/programs-courses//']

    def parse(self, response):
        pass
