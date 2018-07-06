
## To run spider:

1. open cmd prompt (a)

2. go to location of project folder by doing:
   ```
   cd pisa_spider
   ```
   
3. open another cmd prompt (b) and run mongod by:
   ```
   cd C:\Program Files\MongoDB\Server\4.0\bin
   mongod
   ```
    
3. run follwoing cmd in cmd prompt (a) to upload data into Mongodb 
   and creates json + csv file automatically:
   ```
   scrapy crawl pisa_spider
   ```
   
## Create new spider

1. open cmd prompt then run:
   ```
   scrapy startproject project_name (eg. scrapy startproject pisa_spider)
   ```
   
## Requirements 

1. Python installed
2. Scrapy installed (using anaconda or miniconda)
3. Pymongo installed
4. mongodb installed
5. option: Robo 3T for mongodb

## Author
Sharad Shrestha
