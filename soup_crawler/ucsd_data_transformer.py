import json

def generate_graph_data (courses):
    edges = []
    nodes = []
    data  = []
    lookup_table = {}

    def insert_entity (name, info):
        id = lookup_table[name] = len(nodes)
        nodes.append({
            'id': id,
            'label': name
        })
        data.append({
            'id': len(nodes),
            'name': name,
            'dept': info['dept'] if 'dept' in info else name.strip().split()[0],
            'desc': info['desc'] if 'desc' in info else '',
            'edges_from': set(),
            'edges_to': set()
        })

    def lookup (name, info = {}):
        if name not in lookup_table:
            insert_entity(name, info)
        return lookup_table[name]

    for course, info in courses.iteritems():
        self = lookup(course, info)
        for node in map(lookup, info['prereqs']):
            edges += [{ 'from': self, 'to': node }]
            data[self]['edges_from'].add(node)
            data[node]['edges_to'].add(self)

    for i, _ in enumerate(data):
        data[i]['edges_from'] = list(data[i]['edges_from'])
        data[i]['edges_to'] = list(data[i]['edges_to'])
    return { 'edges': edges, 'nodes': nodes, 'data': data }

if __name__ == '__main__':
    with open('ucsd_courses.json', 'r') as f:
        content = json.loads(f.read())
        print(len(content['courses']))
        courses = content['courses']

    with open('ucsd_graph_data.json', 'w') as f:
        data = generate_graph_data(courses)
        print(len(data))
        print(len(data['nodes']))
        print(len(data['edges']))
        print(len(data['data']))
        json.dump(data, f)

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



