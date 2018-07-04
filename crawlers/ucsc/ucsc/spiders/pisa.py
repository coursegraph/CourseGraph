# -*- coding: utf-8 -*-
import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from ucsc.items import PisaCourseItem, PisaWebEntry


class PisaSpider(scrapy.Spider):
    name = 'pisa'
    allowed_domains = ['pisa.ucsc.edu']
    search_url = 'https://pisa.ucsc.edu/class_search/index.php/'
    start_urls = [search_url]

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
        page_links = response.xpath("//a[contains(@id,'class_id_')]")
        for link in page_links:
            item = PisaWebEntry()
            item['title'] = link.xpath('text()').extract()
            item['url'] = link.xpath('@href').extract()
            yield item
