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

    def __init__(self, *args, **kwargs):
        logger = logging.getLogger('scrapy.spidermiddlewares.httperror')
        logger.setLevel(logging.WARNING)
        super(PisaSpider, self).__init__(*args, **kwargs)

        self.max_index_scrapes = -1
        self.max_page_scrapes = -1
        self.pages_total = 0
        self.pages_done = 0

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

        print("Parsing index '%s'"%response.url)
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

            # Temporarily disabled; this IS valid index data
            #
            # parse course name, title, section
            # parse_course_title(anchor.xpath('text()').extract()[0], result)

            # grab class number + enrollment info
            # rest = item.xpath('div[contains(@class,"panel-body")]/div[contains(@class,"row")]')
            # assert(rest)
            # result['class_number'] = int(rest.xpath('div[1]/a/text()').extract()[0])
            # result['instructor'] = rest.xpath('div[2]/text()').extract()[0].strip()
            # location_info = rest.xpath('div[3]/text()')
            # result['class_type'], result['location'] = location_info.re(r'\s*([A-Z]+):\s+([\s\w]+)')

            # result['meet_times'] = rest.xpath('div[4]/text()').extract()[0].strip()
            # enroll_info = rest.xpath('div[5]/text()')
            # result['enroll_current'], result['enroll_max'] = map(int, enroll_info.re(r'\s*(\d+)\s+of\s+(\d+)'))
            # result['materials_url'] = rest.xpath('div[6]/a/@href').extract()[0]

            # yield result
            # print("Sending crawl request for '%s'"%result['url'])
            if self.max_page_scrapes != 0:
                self.max_page_scrapes -= 1
                yield scrapy.Request(result['url'], callback=self.parse_course_page)
                self.pages_total += 1
        print("%d / %d"%(self.pages_done, self.pages_total))


    def parse_course_page(self, response):
        result = PisaCourseItem()
        content = response.xpath('body/div[contains(@class,"panel")]/div[contains(@class,"panel-body")]')
        assert(content)

        parse_course_title(content.xpath('div[1]/div/h2/text()').extract()[0], result)
        result['term'] = content.xpath('div[2]/div/text()').extract()[0].strip()

        def parse_panel_class_details (panel_body):
            details = panel_body.xpath('div[contains(@class,"row")]')
            left_panel, right_panel = details.xpath('div[1]/dl'), details.xpath('div[2]/dl')
            result['career_type'] = left_panel.xpath('dd[1]/text()').extract()[0].strip('"')
            result['grading_options'] = left_panel.xpath('dd[2]/text()').extract()[0].strip('"')
            result['class_number'] = int(left_panel.xpath('dd[3]/text()').extract()[0].strip('"'))
            result['lecture_number'] = result['class_number']
            class_type = left_panel.xpath('dd[4]/text()').extract()[0].strip('"')
            try:
                result['class_type'] = {
                    'Lecture': 'LEC',
                    'Discussion': 'DISC',
                    'Seminar': 'SEM',
                    'Laboratory': 'LAB',
                    'Field Studies': 'FLD',
                    'Studio': 'fixme (Studio)',
                }[class_type]
            except KeyError:
                print("FIXME unhandled class type: '%s'"%class_type)
                # raise Exception("Unhandled class_type: '%s'"%class_type)
            result['credits'] = left_panel.xpath('dd[5]/text()').extract()[0].strip('"')
            result['gen_ed_categories'] = left_panel.xpath('dd[5]/text()').extract()[0].strip('"')
            avail_seats = int(right_panel.xpath('dd[2]/text()').extract()[0].strip('"'))
            result['enroll_max'] = int(right_panel.xpath('dd[3]/text()').extract()[0].strip('"'))
            result['enroll_current'] = int(right_panel.xpath('dd[4]/text()').extract()[0].strip('"'))
            result['waitlist_max'] = int(right_panel.xpath('dd[5]/text()').extract()[0].strip('"'))
            result['waitlist_current'] = int(right_panel.xpath('dd[6]/text()').extract()[0].strip('"'))
            # assert(avail_seats == result['enroll_max'] - result['enroll_current'])

        def parse_panel_description (panel_body):
            result['course_description'] = panel_body.xpath('text()').extract()[0].strip()

        def parse_panel_enrollment_reqs (panel_body):
            result['enrollment_reqs'] = panel_body.xpath('text()').extract()[0].strip()

        def parse_panel_class_notes (panel_body):
            result['class_notes'] = panel_body.xpath('text()').extract()[0].strip()

        def parse_panel_meeting_info (panel_body):
            meet_info = panel_body.xpath('table')
            meet_info = panel_body.xpath('tbody') or meet_info
            meet_info = meet_info.xpath('tr[2]')
            # print(meet_info.extract())
            if meet_info:
                result['meet_times'] = meet_info.xpath('td[1]/text()').extract()[0].strip()
                result['location'] = meet_info.xpath('td[2]/text()').extract()[0].strip()
                result['instructor'] = meet_info.xpath('td[3]/text()').extract()[0].strip()
                result['class_dates'] = meet_info.xpath('td[4]/text()').extract()[0].strip()

        def parse_panel_sections (panel_body):
            pass

        def parse_panel_combined_sections (panel_body):
            pass

        panels = content.xpath('div[contains(@class,"panel-group")]/div[contains(@class,"row")]')
        for panel in panels:
            header = panel.xpath('div[contains(@class,"panel-heading")]/h2/text()').extract()[0].strip()
            body = panel.xpath('div[contains(@class,"panel-body")]')
            try:
                {
                    'Class Details': parse_panel_class_details,
                    'Description': parse_panel_description,
                    'Enrollment Requirements': parse_panel_enrollment_reqs,
                    'Class Notes': parse_panel_class_notes,
                    'Meeting Information': parse_panel_meeting_info,
                    'Combined Sections': parse_panel_combined_sections,
                    'Associated Discussion Sections or Labs': parse_panel_sections,
                }[header](body)
            except KeyError:
                raise Exception("Unhandled panel: '%s', with content:\n%s"%(header, body.extract()))

        yield result
        self.pages_done += 1
        print("%d / %d"%(self.pages_done, self.pages_total))
