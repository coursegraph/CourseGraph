# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

import pymongo

from scrapy.conf import settings
from scrapy.exceptions import DropItem
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
from scrapy.contrib.exporter import JsonItemExporter
from scrapy.contrib.exporter import CsvItemExporter

>>>>>>> master
>>>>>>> development
from scrapy import log

class PisaSpiderPipeline(object):
    def __init__(self):
        connection = pymongo.MongoClient(
            settings['MONGODB_SERVER'],
            settings['MONGODB_PORT']
        )
        db = connection[settings['MONGODB_DB']]
        self.collection = db[settings['MONGODB_COLLECTION']]
                
    def process_item(self, item, spider):
        valid = True
        for data in item:
            if not data:
                valid = False
                raise DropItem("Missing {0}!".format(data))
        if valid:
            self.collection.insert(dict(item))
            log.msg("course_data added to MongoDB database!",
                    level=log.DEBUG, spider=spider)
        return item    
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
        
class JsonPipeline(object):
    def __init__(self):
        self.file = open("pisa_data.json", 'wb')
        self.exporter = JsonItemExporter(self.file, encoding='utf-8', ensure_ascii=False)
        self.exporter.start_exporting()
 
    def close_spider(self, spider):
        self.exporter.finish_exporting()
        self.file.close()
 
    def process_item(self, item, spider):
        self.exporter.export_item(item)
        return item
        
class CsvPipeline(object):
    def __init__(self):
        self.file = open("pisa_data.csv", 'wb')
        self.exporter = CsvItemExporter(self.file, str)
        self.exporter.start_exporting()
 
    def close_spider(self, spider):
        self.exporter.finish_exporting()
        self.file.close()
 
    def process_item(self, item, spider):
        self.exporter.export_item(item)
        return item

def create_valid_csv(self, item):
    for key, value in item.items():
        is_string = (isinstance(value, basestring))
        if (is_string and ("," in value.encode('utf-8'))):
            item[key] = "\"" + value + "\""        
>>>>>>> master
>>>>>>> development
