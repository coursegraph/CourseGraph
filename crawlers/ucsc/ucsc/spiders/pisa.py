# -*- coding: utf-8 -*-
import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from ucsc.items import PisaIndexItem, PisaCourseItem
import re

site_path = lambda path: '{}/{}'.format(
    'https://pisa.ucsc.edu/class_search', path)

class PisaSpider(scrapy.Spider):
    name = 'pisa'
    allowed_domains = ['pisa.ucsc.edu']
    search_url = site_path('index.php')
    start_urls = [ search_url ]

    def parse(self, response):
        yield scrapy.FormRequest(url=self.search_url, 
        formdata={'action':'results',
                  'binds[:term]':'2188',
                  'binds[:reg_status]':'all',
                  'binds[:subject]':'',
                  'binds[:catalog_nbr_op]':'=''',
                  'binds[:catalog_nbr]':'',
                  'binds[:title]':'',
                  'binds[:instr_name_op]':'=''',
                  'binds[:instructor]':'',
                  'binds[:ge]':'',
                  'binds[:crse_units_op]':'=''',
                  'binds[:crse_units_from]':'',
                  'binds[:crse_units_to]':'',
                  'binds[:crse_units_exact]':'',
                  'binds[:days]':'',
                  'binds[:times]':'',
                  'binds[:acad_career]':'',
                  'binds[:session_code]':'', 
                  'rec_start': '0',
                  'rec_dur': '1582'},
        callback=self.parse_course_listings)

    def parse_course_listings(self, response):
        items = response.xpath('//div[contains(@id,"rowpanel")]')
        for item in items:
            result = PisaIndexItem()
            anchor = item.xpath('//a[contains(@id,"class_id_")]')
            result['url'] = site_path(anchor.xpath('@href').extract()[0])

            # parse course name, title, section
            title_info = anchor.xpath('text()').extract()[0]
            match = re.match(r'(\w+\s+\d+)\s+-\s+(\d+)[^\w]+([^\n]+)', title_info)
            if not match:
                raise Exception("Failed to parse '%s'"%title_info)

            result['course_name'] = match.group(1)
            result['course_section'] = match.group(2)
            result['course_name'] = match.group(3)

            yield result
            #yield scrapy.Request(request['url'], callback=self.parse_course_page)

    def parse_course_page(self, response):
        content = response.xpath('//div[@class="panel-body"]')
        result = PisaCourseItem()
        result['content'] = str(content.extract())
        yield result
