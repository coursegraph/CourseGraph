
## To run the pisa web crawler:
    cd crawlers/ucsc
    mkdir logs
    time scrapy crawl pisa --logfile pisa.log -o output.json

## To create a new crawler:
    cd crawlers/ucsc
    scrapy genspider <name> <starting url / domain>

Then open crawlers > ucsc > ucsc (this subdirectory is unavoidable) > spiders > \<yourspidername\>.py
