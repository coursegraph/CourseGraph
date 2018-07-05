# -*- coding: utf-8 -*-
import scrapy
from scrapy.contrib.linkextractors import LinkExtractor
from scrapy.contrib.spiders import CrawlSpider, Rule

from stack.items import StackItem

class StackCrawlerSpider(CrawlSpider):
    name = 'stack_crawler'
    allowed_domains = ['pisa.ucsc.edu']
    search_url = "https://pisa.ucsc.edu/class_search/index.php"
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
        callback=self.parse_item)

    def parse_item(self, response):
        questions = response.xpath('//div[@class="col-xs-6 col-sm-3"][1]')

        for question in questions:
            item = StackItem()
            item['class_number'] = question.xpath('a/text()').extract()
            yield item
            