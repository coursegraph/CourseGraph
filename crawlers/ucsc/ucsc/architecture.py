
class BaseCrawler:
    pass

def item_producer (Item):
    def decorator (fcn):
        def wrapper (self, request):
            result = Item()
            fcn(self, request, result)
        return wrapper
    return decorator

def parser_entrypoint (fcn):
    def wrapper (self, request):
        return fcn(self, request)
    return wrapper
