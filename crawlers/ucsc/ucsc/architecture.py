import scrapy
import re
''' Crappy initial implementation. Minimum required to run / pass. Can add useful features later. '''


class BaseCrawler:
    pass

class SelectorWrapper:
    def __init__ (self, value):
        self.value = value

    def xpath_require_one (self, selection):
        if self.value:
            result = self.value.xpath(selection)
            if result is None or len(result) > 1:
                raise Exception("Expected single selection with '%s', got '%s', prev selection:\n%s"%(
                    selection, result, self.value.extract()))
            return SelectorWrapper(result)
        return self

    def xpath_require_many (self, selection):
        if self.value:
            result = self.value.xpath(selection)
            if result is None:
                raise Exception("Expected 1+ selection(s) with '%s', got '%s', prev selection:\n%s"%(
                    selection, result, self.value.extract()))
            return SelectorWrapper(result)
        return self

    def map_async (self, callback):
        if not self.value:
            callback(self)
        else:
            for entry in self.value:
                callback(SelectorWrapper(entry))

    def xpath_stripped_text (self, selection=None, strip=None):
        if self.value:
            selection = '%s/text()'%selection if selection else 'text()'

            result = self.value.xpath(selection)
            result = result.extract() if result else result
            if result is None:# or len(result) != 1:
                raise Exception("Expected text(), in selection '%s', got '%s' in:\n%s"%(
                    selection, result, self.value.extract()))
            return SelectorWrapper(result[0].strip(strip) if strip else result[0].strip())
        return self

    def xpath_attrib (self, selection, strip=None):
        if self.value:
            result = self.value.xpath(selection)
            result = result.extract() if result else result
            if result is None or len(result) != 1:
                raise Exception("Expected attrib '%s', got '%s' in:\n%s"%(
                    selection, result, self.value.extract()))
            return SelectorWrapper(result[0].strip(strip) if strip else result[0].strip())
        return self



    def bind (self, result, attrib):
        if self.value:
            value = self.value if type(self.value) == str or type(self.value) == unicode or type(self.value) == int \
                else self.value.extract()[0]
            if type(attrib) == str or type(attrib) == unicode:
                result[attrib] = self.value
            elif type(attrib) == tuple:
                for k in attrib:
                    result[k] = self.value
            else:
                raise Exception("Invalid argument passed to %s.bind(): %s %s"%(
                    type(self), type(attrib), attrib))
        else:
            result[attrib] = None
            print("Failed to assign attrib '%s' to %s in %s"%(
                attrib, type(result[attrib]), type(result)))

    def equals (self, other):
        # if (type(self.value) == str or type(self.value) == unicode) == (type(other) == str or type(other) == unicode):
        #     pass
        # if type(self.value) != type(other):
        #     raise Exception("%s.equals() attempting to compare conflicting types: %s and %s"%(
        #         type(self), type(self.value), type(other)))
        return self.value == other

    def matches_re (self, regex):
        if not self.value:
            raise Exception("Attempting to do regex match on null result")

        if type(self.value) == str or type(self.value) == unicode:
            return re.match(regex, self.value) is not None
        return self.value.re(regex) is not None

    def contains (self, other):
        if type(self.value) == str or type(self.value) == unicode:
            return other in self.value
        return self.value.contains(other)

    def bind_re (self, regex, result, attrib):
        if self.value:
            try:
                value = self.value.extract()[0]
            except AttributeError:
                value = self.value
            # value = self.value if type(self.value) == str or type(self.value) == unicode or type(self.value) == int \
            #     else self.value.extract()[0]
            
            match = re.match(regex, self.value)
            if not match:
                raise Exception("Failed to match regex '%s' against input %s"%(
                    match, value))

            if type(attrib) == str or type(attrib) == unicode:
                result[attrib] = match.group(1)
            elif type(attrib) == tuple:
                for i, k in enumerate(attrib):
                    result[k] = match.group(i+1)
            else:
                raise Exception("Invalid argument passed to %s.bind_re(): %s %s"%(
                    type(self), type(attrib), attrib))
        else:
            result[attrib] = None
            print("Failed to assign attrib '%s' to %s in %s"%(
                attrib, type(result[attrib]), type(result)))

    def bind_re_map (self, regex, result, attrib, transform):
        if self.value:
            value = self.value if type(self.value) == str or type(self.value) == int or type(self.value) == unicode \
                else self.value.extract()[0]
            
            match = re.match(regex, value)
            if not match:
                raise Exception("Failed to match regex '%s' against input %s"%(
                    regex, value))

            if type(attrib) == str:
                result[attrib] = transform(match.group(1))
            elif type(attrib) == tuple:
                for i, (k, f) in enumerate(zip(attrib, transform)):
                    result[k] = f(match.group(i+1))
            else:
                raise Exception("Invalid argument passed to %s.bind_re(): %s %s"%(
                    type(self), type(attrib), attrib))
        else:
            result[attrib] = None
            print("Failed to assign attrib '%s' to %s in %s"%(
                attrib, type(result[attrib]), type(result)))

    def to_int (self):
        if self.value:
            return SelectorWrapper(int(self.value))
        return self

    def request_async_crawl (self, crawler=None, url=None):
        assert(crawler is not None and url is not None)


    def map_sequential_cases (self, selection=None, check='maybe', cases=None):
        assert(check in set(('yes', 'no', 'maybe')))
        assert(cases is not None)
        assert(type(cases) == tuple)
        assert(type(cases[0]) == tuple)
        assert(type(cases[0][0]) == str)

        do_check = check != 'no'
        if not self.value:
            for req, test, applicator in cases:
                applicator(self)
        else:
            results = self.value.xpath(selection) if selection else self.value
            i = 0
            for item in results:
                result = SelectorWrapper(item)
                if i > len(cases):
                    print("Too few items to match all cases")
                    return
                if do_check and not cases[i][1](result):
                    if cases[i][0] == 'required':
                        raise Exception("Failed map_sequential_cases case test (%d):\n%s"%(
                            i, result))
                else:
                    cases[i][2](result)
                    i += 1
            if i < len(cases):
                print("Did not visit all items")


def item_producer (Item):
    def decorator (fcn):
        def wrapper (self, request):
            result = Item()
            fcn(self, request, result)
        return wrapper
    return decorator

def parser_entrypoint (fcn):
    def wrapper (self, request):
        return fcn(self, SelectorWrapper(request))
    return wrapper
