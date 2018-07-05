# -*- coding: utf-8 -*-
import scrapy
import logging
import re
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from ucsc.items import PisaIndexItem, PisaCourseItem

site_path = lambda path: '{}/{}'.format(
    'https://pisa.ucsc.edu/class_search', path)

class PisaSpider(scrapy.Spider):
    name = 'pisa'
    allowed_domains = ['pisa.ucsc.edu']
    search_url = site_path('index.php')
    start_urls = [ search_url ]

    def __init__(self, *args, **kwargs):
        self.max_index_entries  = 10
        self.max_course_entries = 10

        logger = logging.getLogger('scrapy.spidermiddlewares.httperror')
        logger.setLevel(logging.WARNING)
        super(PisaSpider, self).__init__(*args, **kwargs)

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
        if self.max_index_entries == 0:
            return
        for item in items:
            if self.max_index_entries == 0:
                return
            self.max_index_entries -= 1

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

            # grab class number
            result['class_number'] = item.xpath('//a[contains(@id,"class_nbr")]').extract()[0]

            # TBD: grab everything else (is wrapped in a <div class="row">, so maybe
            # use an xpath selector for that and iterate its div children...?
            # Each remaining field is in text inside of one of these divs; use
            # regexes to clean up and eg. separate class_type ("LEC") from location, etc...

            # Also TBD: this is slow AF so maybe (eventually) optimize this to, well,
            # have less shit performance (note: prob xpath), but also be properly async 
            # (visit page => generate async todo-queue to process each item individually)
            # so that we can use multiprocessing to further speed up

            # TBD: also need to store the term info (retain this somehow?),
            # and would ideally like a timestamp somewhere on the outputted data

            yield result
            # yield scrapy.Request(result['url'], callback=self.parse_course_page)

    def parse_course_page(self, response):
        if self.max_course_entries == 0:
            return
        self.max_course_entries -= 1

        content = response.xpath('//div[@class="panel-body"]')
        result = PisaCourseItem()
        result['content'] = str(content.extract())
        yield result

        # TBD: actually parse this and process it, etc...
