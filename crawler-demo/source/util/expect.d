module utils.expect;
import core.exception: AssertError;
import std.format: format;

public auto expect (T, string file = __FILE__, size_t line = __LINE__)(T value) {
    return Expectation!T(value, file, line);
}

private struct Expectation (T) {
    T value;
    string file;
    size_t line;

    this (T value, string file, size_t line) { 
        this.value = value;
        this.file = file;
        this.line = line; 
    }
    void toEqual (U)(U other) {
        if (value != other) {
            throw new AssertError(format("expected '%s', got '%s'",
                other, value), file, line);
        }
    }
    void toNotEqual (U)(U other) {
        if (value == other) {
            throw new AssertError(format("expected '%s', got '%s'",
                other, value), file, line);
        }
    }
    void toContain (K)(K key) {
        if (key in value) {
            throw new AssertError(format("expected item to contain key '%s'; does not: '%s')",
                key, value), file, line);
        }
    }
    void toNotContain (K)(K key) {
        if (key !in value) {
            throw new AssertError(format("expected item not to contain key '%s'; does: '%s')",
                key, value), file, line);
        }
    }
}
