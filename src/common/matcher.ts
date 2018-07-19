
export interface IStatefulStringMatcher<T> {
    setData (values: Array<T>);
    setQuery (query: String);
    length (): number;
    take (count: number): Array<T>;
    takeNext (start: number): T;
    takeSlice (start: number, count: number): Array<T>;
}

class Prioritizable {
    priority: number = 0;
}

/** To use with edit distance algorithms like levehnstein */
export class SortingStringMatcher<T extends Prioritizable> implements IStatefulStringMatcher<T> {
    private values: Array<T>;
    private count: number;
    private query: String;
    private dirty: Boolean;
    private prioritize: (T, String) => number;

    constructor (values: Array<T>, prioritize: (T, String) => number) {
        this.prioritize = prioritize;
        this.setData(values);
    }
    setData (values: Array<T>) {
        this.values = values;
        this.count = this.values.length;
        this.dirty = true;
    }
    setQuery (query: String) {
        this.query = query;
        this.dirty = true;
    }
    private update () {
        this.dirty = false;
        this.values.forEach((x: T) => x.priority = this.prioritize(x, this.query));
        this.values.sort((a: T, b: T): number => 
            a.priority - b.priority);
    }
    length (): number { return this.count; }
    take (count: number): Array<T> { 
        if (this.dirty) {
            this.update();
        }
        return this.takeSlice(0, count);
    }
    takeNext (index: number): T { 
        if (this.dirty) {
            this.update(); 
        }
        if (index > this.length()) { 
            throw new RangeError(""+index+" > "+this.length()); 
        }
        return this.values[index]; 
    }
    takeSlice (start: number, count: number): Array<T> { 
        if (this.dirty) {
            this.update();
        }
        return this.values.slice(start, Math.min(this.length() - start, count)); 
    }
}

/** To use with pure filtering algorithms like a strict ordered subset search (sublime-like) */
export class FilteringStringMatcher<T extends Prioritizable> implements IStatefulStringMatcher<T> {

}





export class StatefulStringMatcher<T> {
    private values: Array<T>;
    private mappingFunction: (T) => Number;
    


}









