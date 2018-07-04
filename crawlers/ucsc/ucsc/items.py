# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy
from scrapy.item import Item, Field

class PisaIndexItem(scrapy.Item):
    """ Encapsulates all the data visible from a Pisa course listing on pisa.ucsc.edu/class_search/index.php """
    url = Field()               # url of class page, eg. "https://pisa.ucsc.edu/class_search/index.php/index.php?action=detail&class_data=YToyOntzOjU6IjpTVFJNIjtzOjQ6IjIxODgiO3M6MTA6IjpDTEFTU19OQlIiO3M6NToiMjE3MjMiO30%3D"
    course_name = Field()       # string, eg. "AMS 03"
    course_title = Field()      # string, eg. "Precalculus"
    course_section = Field()    # string, eg. "01"
    class_number = Field()      # int, eg. 21723
    instructor = Field()        # string, eg. "Garaud,P."
    class_type = Field()        # "LEC", "LAB", or "SEM" (or "DISC"...?)
    location = Field()          # string, eg. "Soc Sci 2 075"
    meet_times = Field()        # string, eg. "MWF 10:40AM-11:45AM"
    enroll_max = Field()        # int
    enroll_current = Field()    # int
    materials_url = Field()     # link to materials page, eg. "http://ucsc.verbacompare.com/comparison?id=FL18__AMS__003__01"
    term = Field()              # TBD, eg. "Fall 2018"
    term_id = Field()           # TBD, integer id used when searching via form


class PisaCourseItem(scrapy.Item):
    """ Encapsulates all the data visible from a class page; TBD """
    raw_content = Field()       # raw HTML; todo: parse this properly using xpath + regexes
