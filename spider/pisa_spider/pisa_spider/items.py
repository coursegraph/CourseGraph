# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy

from scrapy.item import Item, Field

class PisaSpiderItem(Item):
    course_title = Field()
    class_number = Field()
    instructor = Field()
    time = Field()
    location = Field()
    time = Field() 
    enrolled = Field()
    book = Field()
    course_url = Field()