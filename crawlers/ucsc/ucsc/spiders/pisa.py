# -*- coding: utf-8 -*-
import scrapy


class PisaSpider(scrapy.Spider):
    name = 'pisa'
    allowed_domains = ['https://pisa.ucsc.edu/class_search/index.php']
    start_urls = ['http://https://pisa.ucsc.edu/class_search/index.php/']

    def parse(self, response):
        pass
