# -*- coding: utf-8 -*-
import scrapy
from scrapy.contrib.linkextractors import LinkExtractor
from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy import log

from ..items import PisaSpiderItem

class StackCrawlerSpider(CrawlSpider):
    name = 'pisa_spider'
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
        item1 = response.xpath('//*[@class="panel-heading panel-heading-custom"]/h2/a/text()').extract()
        item1 = [i.replace("\xa0", " ") for i in item1]
        item2 = response.xpath('//*[@class="col-xs-6 col-sm-3"][1]/a/text()').extract()
        item3 = response.xpath('//*[@class="col-xs-6 col-sm-3"][2]/text()').extract()
        item4 = response.xpath('//*[@class="col-xs-6 col-sm-3"][4]/text()').extract()
        item5 = response.xpath('//*[@class="col-xs-6 col-sm-3"][3]/text()').extract()
        item6 = response.xpath('//*[@class="col-xs-6 col-sm-3"][5]/text()').extract()
        item7 = response.xpath('//*[@class="col-xs-6 col-sm-3 hide-print"]/a/@href').extract()
        item8 = response.xpath('//*[@class="panel-heading panel-heading-custom"]/h2/a/@href').extract()
        item8 = [i.replace("index.php?", "https://pisa.ucsc.edu/class_search/index.php?") for i in item8]
        
        
        for course_title, course_number, instructor, location, time, enrolled, book, course_url  in zip(item1, item2, item3, item4, item5, item6, item7, item8):            
            yield {'course_title': course_title.strip(), 
            'course_number': course_number.strip(), 
            'instructor': instructor.strip(), 
            'location': location.strip(), 
            'time': time.strip(), 
            'enrolled': enrolled.strip(), 
            'book': book.strip() , 
            'course_url':course_url.strip()}