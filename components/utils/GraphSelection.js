//Graph Selection class

class GraphSelection {
  constructor(nodes, ids) {
    this.nodeMap = new Map();
    this.edgeMap = new Map();
    //Leaves them as empty maps if not args provided
    if (typeof (nodes) === 'object' && typeof (ids) !== 'undefined') {
      buildGraph(nodes, ids, this.nodeMap, this.edgeMap);
    }
  }

  addNodes(nodes, ids) {
    buildGraph(nodes, ids, this.nodeMap, this.edgeMap);
  }

  removeNodes(nodes, ids) {
    cleanGraph(nodes, ids, this.nodeMap, this.edgeMap);
  }

  clear() {
    this.nodeMap.clear();
    this.edgeMap.clear();
  }

  getGraphData() {
    const graphEdges = this.edgeMap.values();
    const graphNodes = this.nodeMap.values();
    const graphData = {
      edges: Array.from(graphEdges),
      nodes: Array.from(graphNodes),
    };
    return graphData;
  }



}



function addFromEdges(nodes, id, nodeMap, edgeMap) {
  const edgesFrom = nodes[id].edges_from;

  edgesFrom.forEach((fromID, index) => {
    //Give every edge a unique key
    edgeMap.set(
      `${fromID}_${id}`,
      {'from': fromID, 'to': id}
    );
    if (!nodeMap.has(fromID)) {
      nodeMap.set(fromID, nodes[fromID]);
      addFromEdges(nodes, fromID, nodeMap, edgeMap);
    }
  });
}

function buildGraph(nodes, ids, nodeMap, edgeMap) {

  if (typeof (ids) === 'number') {
    if (!nodeMap.has(ids)) {
      nodeMap.set(ids, nodes[ids]);
      addFromEdges(nodes, ids, nodeMap, edgeMap);
    }
  } else {
    ids.forEach((id) => {
      if (!nodeMap.has(id)) {
        nodeMap.set(id, nodes[ids]);
        addFromEdges(nodes, id, nodeMap, edgeMap);
      }
    });
  }
  console.log(edgeMap);
}

function cleanFromEdges(nodes, id, nodeMap, edgeMap) {
  const edgesFrom = nodes[id].edges_from;
  const edgesTo = nodes[id].edges_to;
  nodeMap.delete(id);
  //console.log(`recieved edges from: ${edgesFrom}`);

  //Delete edges by their unique key
  edgesTo.forEach((toID, index) => {
    console.log(`removing key: ${index}_${id}`);
    edgeMap.delete(`${index}_${id}`);
  });
  edgesFrom.forEach((fromID, index) => {
    console.log(`removing key: ${id}_${index}`);
    edgeMap.delete(`${fromID}_${id}`);
    if (nodeMap.delete(fromID)) {
      cleanFromEdges(nodes, fromID, nodeMap, edgeMap);
    }
  });

}

function cleanGraph(nodes, ids, nodeMap, edgeMap) {
  console.log('in clean');
  if (typeof (ids) === 'number') {
    if (nodeMap.has(ids)) {
      console.log('number clean');
      cleanFromEdges(nodes, ids, nodeMap, edgeMap);
    }
  } else {
    console.log('somehow here');
    ids.forEach( (id) => {
      if (nodeMap.has(id)) {
        cleanFromEdges(nodes, id, nodeMap, edgeMap);
      }
    });
  }
}
//export default GraphSelection;

const nodes = [
  {
    'dept': 'life',
    'description': 'being able to make good use of college',
    'edges_from': [
      4,
      5,
    ],
    'edges_to': [
      1,
    ],
    'id': 0,
    'label': 'CL 101',
    'title': 'How to College',
  },
  {
    'dept': 'life',
    'description': 'Doing more advanced college stuff',
    'edges_from': [
      0,
    ],
    'edges_to': [
      2,
      3,
    ],
    'id': 1,
    'label': 'CL 102',
    'title': 'Advanced college',
  },
  {
    'dept': 'life',
    'description': 'Welcome to the real world ya pansy!',
    'edges_from': [
      1,
    ],
    'edges_to': [],
    'id': 2,
    'label': 'RL 7',
    'title': 'REAL LIFE',
  },
  {
    'dept': 'Life',
    'description': 'Your educated, now getting rich',
    'edges_from': [
      1,
    ],
    'edges_to': [],
    'id': 3,
    'label': 'RL M2',
    'title': 'Getting Money',
  },
  {
    'dept': 'PD',
    'description': 'You are not that important, accept it',
    'edges_from': [
      8,
    ],
    'edges_to': [
      0,
    ],
    'id': 4,
    'label': 'PD 42',
    'title': 'Getting over yourself',
  },
  {
    'dept': 'HS',
    'description': 'A totally wonderful time',
    'edges_from': [
      6,
      7,
    ],
    'edges_to': [
      0,
    ],
    'id': 5,
    'label': 'HS K',
    'title': 'High School stuff',
  },
  {
    'dept': 'HS',
    'description': 'seeing how terrible people, especially kids, are',
    'edges_from': [
      8,
    ],
    'edges_to': [
      5,
    ],
    'id': 6,
    'label': 'HS 69',
    'title': 'Petty School Drama',
  },
  {
    'dept': 'PD',
    'description': 'the essential stage of life that is childhood',
    'edges_from': [],
    'edges_to': [
      5,
    ],
    'id': 7,
    'label': 'PD 3',
    'title': 'Kid stuff',
  },
  {
    'dept': 'PD',
    'description' : 'we have all been *that* person before',
    'edges_from' : [],
    'edges_to' : [
      4,
      6,
    ],
    'id' : 8,
    'label' : 'PD FU',
    'title' : 'Being a snot nosed brat',
  },
  {
    'dept': '=/',
    'description': 'question mark',
    'edges_from': [],
    'edges_to': [],
    'id': 9,
    'label': 'whatevs',
    'title': 'whatevs',
  },
];

function outPut(graph) {
  const data = graph.getGraphData();
  console.log('NEW OUTPUT SEGMENT STARTS HERE!');
  data.nodes.forEach( (x) => {
    console.log(x.id);
  });
  console.log(data.edges);
}

let myGraph = new GraphSelection(nodes, 0);
outPut(myGraph);

//myGraph.addNodes(nodes, 3);
//outPut(myGraph);

myGraph.removeNodes(nodes, 5);
myGraph.clear();
outPut(myGraph);
