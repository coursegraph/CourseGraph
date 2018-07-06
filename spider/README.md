
## To run spider:

1. Open cmd prompt (a)

2. go to location of project folder by doing:
   cd pisa_spider
   
3. open another cmd prompt (b) and run mongod by:
   cd C:\Program Files\MongoDB\Server\4.0\bin
   mongod
    
3. run follwoing cmd in cmd prompt (a) to upload data into Mongodb and create json file:
   scrapy crawl pisa_spider -o pisa_data.json -t json)
   
   
## create new spider

1. open cmd prompt then run:
   scrapy startproject stack
   
   
## Requirements 

1. Python installed
2. Scrapy installed (using anaconda or miniconda)
3. Pymongo installed
4. mongodb installed
5. option: Robo 3T for mongodb

   
