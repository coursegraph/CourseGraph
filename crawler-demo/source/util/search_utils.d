module util.search_utils;
import arsd.dom;
import std.regex;
import std.exception: enforce;
import std.format: format;

ElementRange range (Element elem) {
    return ElementRange(elem);
}

bool regexMatch (string regex, Args...)(Element elem, ref Args args) {
    auto match = matchFirst(elem.innerText, ctRegex!regex);
    if (!match) return false;
    size_t i = 0;
    foreach (ref arg; args) {
        arg = match[++i];
    }
    return true;
}

struct ElementRange {
    Element head; size_t child;

    this (Element elem) { this.head = elem; child = 0; }
    this (Element elem, size_t child) { this.head = elem; this.child = child; }

    @property Element front () { return head[child]; }
    bool empty () { return head[child] !is null; }
    void popFront () { ++child; }
    ElementRange save () { return ElementRange(head, child); }

    ref ElementRange requireSeq (bool delegate (Element elem) predicate) {
        auto start = save();
        while (!empty && !predicate(front)) {
            popFront;
        }
        enforce(!empty, format("Failed to find sequence, starting at %s", save.front.innerHTML));
        return this;
    }
}
