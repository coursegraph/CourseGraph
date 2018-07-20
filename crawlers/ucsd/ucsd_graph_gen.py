from ucsd_crawler import fetch_ucsd_courses
import json

def generate_graph_data (courses, limit = -1):
    edges = []
    nodes = []
    lookup_table = {}

    def insert_entity (name, info):
        id = lookup_table[name] = len(nodes)
        nodes.append({
            'id': len(nodes),
            'label': name,
            'title': info['title'] if 'title' in info else '',
            'dept': info['dept'] if 'dept' in info else name.strip().split()[0],
            'description': info['description'] if 'description' in info else '',
            'edges_from': set(),
            'edges_to': set()
        })

    def lookup (name, info = {}):
        if name not in lookup_table:
            insert_entity(name, info)
        return lookup_table[name]

    for course, info in courses.iteritems():
        if limit >= 0:
            if limit == 0:
                break
            limit -= 1
        self = lookup(course, info)
        for node in map(lookup, info['prereqs']):
            edges += [{ 'from': node, 'to': self }]
            nodes[self]['edges_from'].add(node)
            nodes[node]['edges_to'].add(self)

    for i, _ in enumerate(nodes):
        nodes[i]['edges_from'] = list(nodes[i]['edges_from'])
        nodes[i]['edges_to'] = list(nodes[i]['edges_to'])
    return { 'edges': edges, 'nodes': nodes }

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Generates vizjs graph data from the ucsd course catalog')
    parser.add_argument('-i', '--input', type=str, help='input file', nargs='?', default='ucsd_courses.json')
    parser.add_argument('-o', '--out', type=str, help='output file', nargs='?', default='ucsd_graph_data.json')
    parser.add_argument('-r', '--rebuild', default=False, action='store_true')
    parser.add_argument('-l', '--limit', type=int, default=-1)
    parser.add_argument('-n', '--parallel', type=int, nargs='?', default=16)
    parser.add_argument('--indent', type=int, nargs='?', default=0)
    parser.add_argument('--sort_keys', type=bool, nargs='?', default=True)
    parser.add_argument('-p', '--_print', default=False, action='store_true')
    args = parser.parse_args()

    if args.rebuild:
        from subprocess import call
        call(['python', 'ucsd_crawler.py', '--out', str(args.input), '--parallel', str(args.parallel)])

    if args.rebuild:
        content = fetch_ucsd_courses(
            out_file = args.input,
            return_results = True,
            parallelism = args.parallel
        )
    else:
        with open(args.input, 'r') as f:
            content = json.loads(f.read())
            # print(len(content['courses']))
    courses = content['courses']

    with open(args.out, 'w') as f:
        graph_data = generate_graph_data(courses, limit=args.limit)
        data = {
            'course_info': {
                'ucsd': {
                    'courses': content['courses'],
                    'vizjs': graph_data
                }
            }
        }
        # print(len(data))
        # print(len(data['nodes']))
        # print(len(data['edges']))
        # print(len(data['data']))
        if args.indent:
            json.dump(data, f, indent=args.indent, sort_keys=args.sort_keys)
        else:
            json.dump(data, f, sort_keys=args.sort_keys)
        if args._print:
            if args.indent:
                print(json.dumps(data, indent=args.indent, sort_keys=args.sort_keys))
            else:
                print(json.dumps(data, sort_keys=args.sort_keys))

    missing_references = {}
    resolved_references = {}
    for course, info in sorted(courses.iteritems(), key = lambda (k,v): k):
        for name in info['prereqs']:
            if name not in courses:
                if name not in missing_references:
                    missing_references[name] = { 'count': 1, 'refby': set(), 'name': name }
                else:
                    missing_references[name]['count'] += 1
                missing_references[name]['refby'].add(course)
            else:
                if name not in resolved_references:
                    resolved_references[name] = courses[name]
                    courses[name]['count'] = 1
                    courses[name]['refby'] = set()
                else:
                    resolved_references[name]['count'] += 1
                resolved_references[name]['refby'].add(course)
    # print("%s resolved references"%(len(resolved_references)))
    # for k, v in sorted(resolved_references.iteritems(), key = lambda (k, v): k):
    #     print("\t%s (%s references): %s"%(k, v['count'], ', '.join(v['refby'])))

    # print("\n%s missing references"%(len(missing_references)))
    # for k, v in sorted(missing_references.iteritems(), key = lambda (k, v): k):
    #     print("\t%s (%s references): %s"%(k, v['count'], ', '.join(v['refby'])))



