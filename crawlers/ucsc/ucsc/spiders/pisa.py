# -*- coding: utf-8 -*-
import scrapy
import logging
import re
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from ucsc.items import PisaIndexItem, PisaCourseItem

site_path = lambda path: '{}/{}'.format(
    'https://pisa.ucsc.edu/class_search', path)

def parse_course_title (text, result):
    assert(text)
    match = re.match(r'\s*(\w+\s+\d+[A-Z]?)[^\d]+(\d+)[^\w]+([^\n]+)', text)
    if not match:
        raise Exception("Failed to parse '%s'"%text)
    result['course_name'] = match.group(1)
    result['course_section'] = match.group(2)
    result['course_title'] = match.group(3).strip()

class PisaSpider(scrapy.Spider):
    name = 'pisa'
    allowed_domains = ['pisa.ucsc.edu']
    search_url = site_path('index.php')
    start_urls = [ search_url ]

    def __init__(self, item_count):
        self.item_count = item

    def __init__(self, *args, **kwargs):
        logger = logging.getLogger('scrapy.spidermiddlewares.httperror')
        logger.setLevel(logging.WARNING)
        super(PisaSpider, self).__init__(*args, **kwargs)

        self.max_index_scrapes = 10
        self.max_page_scrapes = 10

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
        callback=self.parse_course_index)

    def parse_course_index(self, response):
        if self.max_index_scrapes == 0:
            return

        items = response.xpath('body/div[contains(@class,"center-block")]/div[@class="panel-body"]/div[contains(@id,"rowpanel")]')
        assert(items)
        for item in items:
            if self.max_index_scrapes == 0:
                return
            self.max_index_scrapes -= 1

            result = PisaIndexItem()
            anchor = item.xpath('div[contains(@class,"panel-heading")]/h2/a[contains(@id,"class_id_")]')
            assert(anchor)
            result['url'] = site_path(anchor.xpath('@href').extract()[0])

            # parse course name, title, section
            parse_course_title(anchor.xpath('text()').extract()[0], result)

            # grab class number + enrollment info
            rest = item.xpath('div[contains(@class,"panel-body")]/div[contains(@class,"row")]')
            assert(rest)
            result['class_number'] = int(rest.xpath('div[1]/a/text()').extract()[0])
            result['instructor'] = rest.xpath('div[2]/text()').extract()[0].strip()
            location_info = rest.xpath('div[3]/text()')
            result['class_type'], result['location'] = location_info.re(r'\s*([A-Z]+):\s+([\s\w]+)')

            result['meet_times'] = rest.xpath('div[4]/text()').extract()[0].strip()
            enroll_info = rest.xpath('div[5]/text()')
            result['enroll_current'], result['enroll_max'] = map(int, enroll_info.re(r'\s*(\d+)\s+of\s+(\d+)'))
            result['materials_url'] = rest.xpath('div[6]/a/@href').extract()[0]

            yield result
            if self.max_page_scrapes != 0:
                self.max_page_scrapes -= 1
                yield scrapy.Request(result['url'], callback=self.parse_course_page)


    def parse_course_page(self, response):
        result = PisaCourseItem()
        content = response.xpath('body/div[contains(@class,"panel")]/div[contains(@class,"panel-body")]')
        assert(content)

        parse_course_title(content.xpath('div[1]/div/h2/text()').extract()[0], result)
        result['term'] = content.xpath('div[2]/div/text()').extract()[0].strip()

        info = content.xpath('div[contains(@class,"panel-group")]')
        details = info.xpath('div[1]/div[contains(@class,"panel-body")]/div[1]')

        left_panel = details.xpath('div[1]/dl')
        result['career_type'] = left_panel.xpath('dd[1]/text()').extract()[0].strip('"')
        result['grading_options'] = left_panel.xpath('dd[2]/text()').extract()[0].strip('"')
        result['class_number'] = int(left_panel.xpath('dd[3]/text()').extract()[0].strip('"'))
        result['lecture_number'] = result['class_number']

        result['class_type_pretty'] = left_panel.xpath('dd[4]/text()').extract()[0].strip('"')
        result['credits'] = left_panel.xpath('dd[5]/text()').extract()[0].strip('"')
        result['gen_ed_categories'] = left_panel.xpath('dd[5]/text()').extract()[0].strip('"')

        right_panel = details.xpath('div[2]/dl')
        result['enroll_status'] = right_panel.xpath('dd[1]/text()').extract()[0].strip('"')
        avail_seats = int(right_panel.xpath('dd[2]/text()').extract()[0].strip('"'))
        result['enroll_max'] = int(right_panel.xpath('dd[3]/text()').extract()[0].strip('"'))
        result['enroll_current'] = int(right_panel.xpath('dd[4]/text()').extract()[0].strip('"'))
        assert(avail_seats == result['enroll_max'] - result['enroll_current'])

        result['waitlist_max'] = int(right_panel.xpath('dd[5]/text()').extract()[0].strip('"'))
        result['waitlist_current'] = int(right_panel.xpath('dd[6]/text()').extract()[0].strip('"'))

        result['course_description'] = info.xpath('div[2]/div[contains(@class,"panel-body")]/text()').extract()[0].strip()
        result['enrollment_reqs'] = info.xpath('div[3]/div[contains(@class,"panel-body")]/text()').extract()[0].strip()
        result['class_notes'] = info.xpath('div[4]/div[contains(@class,"panel-body")]/text()').extract()[0].strip()

        meet_info = info.xpath('div[5]/div[contains(@class,"panel-body")]/table')
        if meet_info:
            result['meet_times'] = meet_info.xpath('td[1]/text()').extract()[0].strip()
            result['location'] = meet_info.xpath('td[2]/text()').extract()[0].strip()
            result['instructor'] = meet_info.xpath('td[3]/text()').extract()[0].strip()
            result['class_dates'] = meet_info.xpath('td[4]/text()').extract()[0].strip()
        else:

        # print(info.xpath('div[5]/div[contains(@class,"panel-body")]/table').extract())
        # print(info.xpath('div[5]/div[contains(@class,"panel-body")]/table/tbody').extract())
        # print(info.xpath('div[5]/div[contains(@class,"panel-body")]/table/tr[2]').extract())
        # print(meet_info.extract())
        # print(meet_info.xpath('td[1]').extract())

        

        associated_sections = info.xpath('div[6]/div[contains(@class,"panel-body")]')


        yield result











