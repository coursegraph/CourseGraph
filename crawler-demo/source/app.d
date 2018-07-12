import std.stdio;
import std.net.curl: get;


void main()
{
    writeln(get("https://registrar.ucsc.edu/catalog/programs-courses/course-descriptions/math.html"));
}
