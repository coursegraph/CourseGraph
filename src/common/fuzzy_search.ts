import * as assert from 'assert';

export enum StringMatchType { 
    /** Marks matched part of value string + query string */
    MATCHED, 
    
    /** Marks unmatched (skipped) part of value string */
    UNMATCHED, 
    
    /** Marks unmatched part of query string; probably indicates an error if present. */
    ERROR_UNMATCHED_QUERY 
}
export type SpanifyResult = [StringMatchType, String];
export type SpanifyResults = Array<SpanifyResult>;


/** Generic interface for any string matching algorithm */
export interface IStringMatcher {
    /**
     * Matches a value string against a query string.
     * 
     * @param query  The query string (eg. "fzsrch")
     * @param value  The value we're checking (eg. "fuzzy search")
     * @returns true iff the passed in value string matches the query string according to the algorithm we're implementing.
     */
    match (query: String, value: String): boolean;

    /**
     * Spanifies (ie. breaks into sub-strings / matched tokens) a string to visualize how it's being
     * matched by match. Assumes that you've already called match() to determine whether the string matches or not.
     * 
     * @param query  The query string (eg. "fzsrch")
     * @param value  The value we're checking (eg. "fuzzy search")
     * @param results An external, cached array that we can store our results in.
     *  Will have its length set to zero, then appended to.
     *  Not returning a _new_ (allocated) array, b/c that would be wasteful and we'd like to minimize gc.
     * @returns true iff matched everything, false otherwise
     */
    spanify (query: String, value: String, results: SpanifyResults): boolean;

    /**
     * @returns a new SpanifyResults() (ie. new Array<[StringMatchTYpe, String]>()).
     * Convenience function since otherwise this would be annoying.
     */
    newSpanifyResults (): SpanifyResults;
}

export interface IStringPrioritizer {
    priority (value: String): Number;
}
export interface IStringSorter {
    sort (values: String, prioritizer: IStringPrioritizer);
}

export class StringSearchFilterer {
    private sorter:     IStringSorter;
    private filterer:   IStringMatcher | null;
    private spanResults: SpanifyResults | null;

    constructor (sorter: IStringSorter, filterer: IStringMatcher | null) {
        this.sorter = sorter;
        this.filterer = filterer;
        this.spanResults = null;
    }
}





/** 
 * Implements a fuzzy string search algorithm that returns true if query is a strictly ordered subset of value.
 * 
 * @example 
 * ```typescript
 * let fuzzy = new FuzzyMatcher();
 * assert(fuzzy.match("fzy", "fuzzy"));
 * assert(!fuzzy.match("fyz", "fuzzy"));
 * ```
 * @exmaple
 * ```typescript
 * let results = new SpanifyResults();
 * fuzzy.spanify("fzy", "fuzzy", results);
 * console.log('Matching "fuzzy" against "fzy"');
 * results.forEach(function(result){
 *     let match = result[0], substring = result[1];
 *     console.log(''+match+': "'+substring+'"");
 * });
 * ```
 */
export class FuzzyMatcher implements IStringMatcher {
    match (query: String, value: String): boolean {
        let i = value.length, j = query.length;
        while (j != 0 && i >= j) {
            if (value[i - 1] == query[j - 1]) {
                --j;
            }
            --i;
        }
        return j == 0;
    }
    spanify (query: String, value: String, results: SpanifyResults): boolean {
        results.length = 0;

        // Initial spanify function.
        // This code is probably wrong (have yet to test, b/c didn't bother getting
        // typescript setup w/ npm...)

        let i = 0, j = 0, n = value.length, m = query.length;
        while (i < n && j < m) {
            if (value[i] == query[j]) {
                let i0 = i;
                while (i < n && j < m && value[i] == query[j]) {
                    ++i, ++j;
                }
                results.push([ StringMatchType.MATCHED, value.substr(i0, i - i0) ]);
            } else {
                let i0 = i, j0 = j;
                while (i < n && value[i] != query[j0]) ++i;
                while (j < m && value[i0] != query[j]) ++j;
                if ((i - i0) < (j - j0)) {
                    results.push([ StringMatchType.UNMATCHED, value.substr(i0, i - i0) ]);
                    j = j0;
                } else {
                    results.push([ StringMatchType.ERROR_UNMATCHED_QUERY, query.substr(j0, j - j0) ]);
                    i = i0;
                }
            }
        }
        return i == n && j == m;
    }
    newSpanifyResults (): SpanifyResults {
        return new Array<[StringMatchType, String]>();
    }
}

export class SubstringMatcher implements IStringMatcher {
    match (query: String, value: String): boolean {
        return false;
    }
}


