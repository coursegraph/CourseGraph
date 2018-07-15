module util.fetch_html;
import std.net.curl: get, CurlException;
import arsd.dom: Document, Element;

bool fetchHtml (string url, ref Exception error, void delegate(Document) callback) {
    if (error) { return false; }
    Document document = null;
    try {
        auto html = get(url);
        document = new Document(cast(string)html);
    } catch (Exception e) {
        error = e;
        return false;
    }
    callback(document);
    return true;
}
