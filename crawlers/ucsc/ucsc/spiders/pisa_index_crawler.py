'''
    This is a test for an API wrapper around scrapy.
    It passes when the following code can run, and produce complete, correct output to the current crawler (pisa.py).
'''
from ucsc.architecture import BaseCrawler, item_producer
import datetime

def to_datetime_time (hourly_time_string):
    ''' Converts a time string generated by pisa into a python datetime.time value '''
    hours, minutes, am_pm = re.match(r'(\d+):(\d+)(AM|PM)')
    if am_pm == 'PM':
        hours += 12
    return datetime.time(hours, minutes)

# TODO: unittests ^


class PisaCourseIndexCrawler (BaseCrawler):
    def parse (self, response):
        response.xpath_require_one('body') \
            .xpath_require_one('div[contains(@class,"center-block")]') \
            .xpath_require_one('div[@class="panel-body"]') \
            .xpath_require_many('div[contains(@id,"rowpanel")]')
            .map_async(self.parse_index_item)

    @item_producer(PisaIndexItem)
    def parse_index_item (self, response, result):
        anchor = response \
            .xpath_require_one('div[contains(@class,"panel-heading")]') \
            .xpath_require_one('h2/a[contains(@id,"class_id_")]')

        anchor.xpath_attrib('@href').bind(result, 'url')
        anchor.xpath_stripped_text().bind_re(
            r'\s*(\w+\s+\d+[A-Z]?)[^\d]+(\d+)[^\w]+([^\n]+)',
            ('course_name', 'course_section', 'course_title'))

        content = response \
            .xpath_require_one('div[contains(@class,"panel-body")]') \
            .xpath_require_one('div[contains(@class,"row")]')

        content.xpath_require_many('div[@class="col-xs-6 col-sm-3"') \
            .map_sequential_cases(check='maybe', cases=(
                ('required',
                    lambda test: 
                        test.xpath_stripped_text().equals("Class Number:") and \
                        test.xpath_attrib('@id').matches_re(r'class_nbr_\d+') and \
                        test.xpath_attrib('@href').matches_re(
                            r'https://pisa\.ucsc\.edu/class_search/index\.php\?action=detail&class_data=\w+'),
                    lambda value: value.xpath_stripped_text('a').to_int().bind(result, 'class_number')),

                ('required',
                    lambda test: 
                        test.xpath_require_one('i[1]').xpath_attrib('@class').contains('fa-user') and \
                        test.xpath_require_one('i[2]').xpath_attrib('@class').equals('sr-only') and \
                        test.xpath_require_one('i[2]').xpath_stripped_text().equals('Instructor:'),
                    lambda value: value.xpath_stripped_text().bind(result, '')),

                ('required',
                    lambda test:
                        test.xpath_require_one('i[1]').xpath_attrib('@class').contains('fa-location-arrow') and \
                        test.xpath_require_one('i[2]').xpath_attrib('@class').equals('sr-only') and \
                        test.xpath_require_one('i[2]').xpath_stripped_text().equals('Location:'),
                    lambda value: value.xpath_stripped_text().bind_re(
                        r'(\d+)\s+of\s+(\d+)',
                        ('enroll_current','enroll_max'), 
                        (int,int))),

                ('required',
                    lambda test:
                        test.xpath_require_one('i[1]').xpath_attrib('@class').contains('fa-location-arrow') and \
                        test.xpath_require_one('i[2]').xpath_attrib('@class').equals('sr-only') and \
                        test.xpath_require_one('i[2]').xpath_stripped_text().equals('Location:'),
                    lambda value: value.xpath_stripped_text().bind_re(
                        r'([M(?:Tu)W(?:Tr)F]+)\s+(\d+:\d+(?:PM|AM))',
                        ('meet_days', 'meet_begin', 'meet_end'),
                        (lambda days: days.replace('Tr','R').replace('Tu','T'), to_time, to_time))),

                ('required',
                    lambda test:
                        test.xpath_stripped_text().matches_re(r'\d+\s+of\d+\s+Enrolled'),
                    lambda value: value.xpath_stripped_text().bind_re_map(
                        r'(\d+)\s+of(\d+)\s+Enrolled',
                        ('enroll_max', 'enroll_current'),
                        (int, int)))
            ))

        # Simpler, but lest robust version:
        content.xpath_stripped_text('div[1]/a').to_int().bind(result, 'class_number')
        content.xpath_stripped_text('div[2]').bind(result, 'instructor')
        content.xpath_stripped_text('div[3]').bind(result, 'location')
        content.xpath_stripped_text('div[4]').bind(result, 'meet_times')
        content.xpath_stripped_text('div[5]').bind_re_map(
                r'\s*(\d+)\s+of\s+(\d+)',
                ('enroll_current','enroll_max'), 
                (int,int)
            )
        content.xpath_attrib('div[6]/a/@href').bind(result, 'materials_url')
        response.request_async_crawl(
            crawler=PisaCoursePageCrawler, 
            url=result['url'])


class PisaCoursePageCrawler (BaseCrawler):
    def parse (self, request):
        pass
