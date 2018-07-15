module util.fetch_html;
import std.net.curl: get, CurlException;
import arsd.dom: Document, Element;
import std.stdio: writefln;

bool fetchHtml (string url, ref Exception error, void delegate(Document) callback) {
    if (error) { return false; }
    string html = null;
    Document document = null;
    try {
        writefln("\u001b[36mFetching %s\u001b[0m", url);
        html = cast(string)get(url);
        document = new Document(html);
    } catch (Exception e) {
        writefln("\u001b[32;1mError fetching %s:\u001b[31m\n\t%s\u001b[0m", url, e);
        error = e;
        return false;
    }
    try {
        callback(document);
        writefln("\u001b[32mFinished loading %s\u001b[0m", url);
    } catch (Throwable e) {
        writefln("\u001b[36mParsing document with url '%s' failed.\n\u001b[31m%s\n\n"~
            "\u001b[33mText Dump:\n%s\n\u001b[0m",
            url, e, html);
    }
    return true;
}
