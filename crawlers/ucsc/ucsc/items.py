# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy
from scrapy.item import Item, Field

class PisaWebEntry(scrapy.Item):
    title = Field()
    url   = Field()

class PisaCourseItem(scrapy.Item):
    course_id = Field()
    instructor = Field()
    location = Field()
    meet_times = Field()
