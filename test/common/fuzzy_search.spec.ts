import { FuzzyMatcher, StringMatchType, SpanifyResult, SpanifyResults } from '../../src/common/fuzzy_search';

describe("FuzzyMatcher tests", () => {
    let fuzzy = new FuzzyMatcher();
    test("It won't bother null checks, since typescript should be capable of handling that for us", () => {
        // Do nothing
    });
    test(".match() should handle input edgecases", () => {
        expect(fuzzy.match("","")).toEqual(true);
        expect(fuzzy.match("asdf", "")).toEqual(false);
        expect(fuzzy.match("", "hello!")).toEqual(true);
    });
    test(".match() should handle input as expected", () => {
        expect(fuzzy.match("a", "a")).toEqual(true);
        expect(fuzzy.match("a", "ab")).toEqual(true);
        expect(fuzzy.match("b", "ab")).toEqual(true);
        expect(fuzzy.match("ab", "a")).toEqual(false);
        expect(fuzzy.match("ab", "b")).toEqual(false);
        expect(fuzzy.match("fzy src", "fuzzy search")).toEqual(true);
        expect(fuzzy.match("fuzzy search", "fzy src")).toEqual(false);
    });
    let results = fuzzy.newSpanifyResults();
    test(".spanify() should behave the same as .match()", () => {
        expect(fuzzy.spanify("", "", results)).toEqual(true);
        expect(fuzzy.spanify("asdf", "", results)).toEqual(false);
        expect(fuzzy.spanify("", "hello!", results)).toEqual(true);
        expect(fuzzy.spanify("a", "a", results)).toEqual(true);
        expect(fuzzy.spanify("a", "ab", results)).toEqual(true);
        expect(fuzzy.spanify("b", "ab", results)).toEqual(true);
        expect(fuzzy.spanify("ab", "a", results)).toEqual(false);
        expect(fuzzy.spanify("ab", "b", results)).toEqual(false);
        expect(fuzzy.spanify("fzy src", "fuzzy search", results)).toEqual(true);
        expect(fuzzy.spanify("fzzy src", "asdf fuzzy search", results)).toEqual(true);
        expect(fuzzy.spanify("fuzzy search", "fzy src", results)).toEqual(false);
    });
    test(".spanify() should return with no results when given empty arguments", () => {
        expect(fuzzy.spanify("", "", results)).toEqual(true);
        expect(results.length).toEqual(0);
    });
    test(".spanify() should return with one matching result when arguments match exactly", () => {
        expect(fuzzy.spanify("foo", "foo", results)).toEqual(true);
        expect(results.length).toEqual(1);
        expect(results[0][0]).toEqual(StringMatchType.MATCHED);
        expect(results[0][1]).toEqual("foo");
    });
    test(".spanify() should return with one unmatched / skipped result when query string is empty", () => {
        expect(fuzzy.spanify("", "foo", results)).toEqual(true);
        expect(results.length).toEqual(1);
        expect(results[0][0]).toEqual(StringMatchType.UNMATCHED);
        expect(results[0][1]).toEqual("foo");
    });
    test(".spanify() should return with one unmatched querry result (error) when value string is empty", () => {
        expect(fuzzy.spanify("foo", "", results)).toEqual(false);
        expect(results.length).toEqual(1);
        expect(results[0][0]).toEqual(StringMatchType.ERROR_UNMATCHED_QUERY);
        expect(results[0][1]).toEqual("foo");
    });
    test(".spanify() should return with the correct results when invoked on a correct match", () => {
        expect(fuzzy.spanify("fzzy src", "asdf fuzzy search", results)).toEqual(true);
        expect(results.length).toEqual(7);
        expect(results[0][0]).toEqual(StringMatchType.UNMATCHED);
        expect(results[0][1]).toEqual("asdf ");
        expect(results[1][0]).toEqual(StringMatchType.MATCHED);
        expect(results[1][1]).toEqual("f");
        expect(results[2][0]).toEqual(StringMatchType.UNMATCHED);
        expect(results[2][1]).toEqual("u");
        expect(results[3][0]).toEqual(StringMatchType.MATCHED);
        expect(results[3][1]).toEqual("zzy s");
        expect(results[4][0]).toEqual(StringMatchType.UNMATCHED);
        expect(results[4][1]).toEqual("ea");
        expect(results[5][0]).toEqual(StringMatchType.MATCHED);
        expect(results[5][1]).toEqual("rc");
        expect(results[6][0]).toEqual(StringMatchType.UNMATCHED);
        expect(results[6][1]).toEqual("h");
    });
    test(".spanify() should (maybe) still return useful results when invoked on an incorrect match", () => {
        expect(fuzzy.spanify("asdf fuzzy search", "fzzy src", results)).toEqual(false);
        expect(results.length).toEqual(7);
        expect(results[0][0]).toEqual(StringMatchType.ERROR_UNMATCHED_QUERY);
        expect(results[0][1]).toEqual("asd");
        expect(results[1][0]).toEqual(StringMatchType.MATCHED);
        expect(results[1][1]).toEqual("f");
        expect(results[2][0]).toEqual(StringMatchType.ERROR_UNMATCHED_QUERY);
        expect(results[2][1]).toEqual(" fu");
        expect(results[3][0]).toEqual(StringMatchType.MATCHED);
        expect(results[3][1]).toEqual("zzy s");
        expect(results[4][0]).toEqual(StringMatchType.ERROR_UNMATCHED_QUERY);
        expect(results[4][1]).toEqual("ea");
        expect(results[5][0]).toEqual(StringMatchType.MATCHED);
        expect(results[5][1]).toEqual("rc");
        expect(results[6][0]).toEqual(StringMatchType.ERROR_UNMATCHED_QUERY);
        expect(results[6][1]).toEqual("h");
    });
});
