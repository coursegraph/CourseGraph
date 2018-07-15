module util.search_utils;
import arsd.dom;
import std.regex;
import std.exception: enforce;
import std.format: format;
import std.stdio: writefln;

ElementRange childRange (Element elem) {
    return ElementRange(elem, 0, elem.children.length);
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
    private Element head;
    private size_t s, e;

    this (Element elem, size_t start, size_t stop) {
        this.head = elem;
        this.s = start;
        this.e = stop;
    }

    private bool bounded () { return s < e; }
    private void assertBounded () { assert(bounded, format("%s > %s!", s, e)); }

    bool empty () { return !bounded; }
    size_t length () { return e - s; }

    Element front () { assertBounded(); return head[s]; }
    Element back () { assertBounded(); return head[e - 1]; }
    Element moveFront () { assertBounded(); return head[s++]; }
    Element moveBack () { assertBounded(); return head[--e]; }
    Element opIndex (size_t i) { 
        assert(s + i < e, format("Out of range: %s + %s = %s > %s!", s, i, s + i, e));
        return head[s + i];
    }
    void popFront () { assertBounded(); ++s; }
    void popBack () { assertBounded(); --e; }
    ElementRange save () { return ElementRange(head, s, e); }

    ref ElementRange requireSeq (bool delegate (Element elem) predicate) {
        auto saved = save();
        //writefln("Range empty? %s", empty);
        while (!empty && !predicate(front)) {
            //writefln("Did not match '%s'", front);
            popFront;
        }
        enforce(!empty, format("Failed to find sequence, starting at %s", 
            !saved.empty ? saved.front.innerHTML : ""));
        popFront;
        //writefln("Matched! %s", front);
        return this;
    }

    unittest {
        import std.range.primitives;
        static assert(isForwardRange!ElementRange);
        static assert(isBidirectionalRange!ElementRange);
        static assert(isRandomAccessRange!ElementRange);
    }

    ref ElementRange processSectionsSplitBy (
        bool delegate (Element) headerPredicate,
        void delegate (Element, ElementRange) handleSection
    ) {
        if (!empty) {
            ElementRange section = save;
            Element header = null;
            for (auto it = save; true; it.popFront) {
                if (it.empty || headerPredicate(it.front)) {
                    section.e = it.s;
                    handleSection(header, section);
                    if (!it.empty) {
                        header = it.front;
                        section.s = it.s + 1;
                    } else break;
                }
            }
        }
        return this;
    }
    ElementRange[string] splitSectionsByHeaders () {
        ElementRange[string] sections;
        processSectionsSplitBy(
            (Element e) { return e.tagName == "h1" || e.tagName == "h2" || e.tagName == "h3"; },
            (Element header, ElementRange section) {
                sections[header ? header.innerText : ""] = section.save;
            }
        );
        return sections;
    }
    string innerText () {
        string text = "";
        for (size_t i = s; i < e; ++i) {
            text ~= head[i].innerText;
        }
        return text;
    }
    string innerHTML () {
        string text = "";
        for (size_t i = s; i < e; ++i) {
            text ~= head[i].innerHTML;
        }
        return text;
    }
}
