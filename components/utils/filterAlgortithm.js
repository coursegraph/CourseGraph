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
];

/**
 * @param nodes {Array.<object>} the entire data set
 * @param id {number}
 * @param newNodes {Array.<object>} the result
 * @param newEdges {Array.<object>} the result
 */
function doFromEdges(nodes, id, newNodes, newEdges) {
  if (id > nodes.length) {
    throw 'Selected Node is out of Range';
  }

  const edgesFrom = nodes[id].edges_from;

  edgesFrom.forEach((fromID) => {
    newEdges.push({
      'from': fromID,
      'to': id,
    });
    if (testUnique(newNodes, fromID)) {
      newNodes.push(nodes[fromID]);
      doFromEdges(nodes, fromID, newNodes, newEdges);
    }
  });
}

function testUnique(newNodes, id) {
  for (let j = 0; j < newNodes.length; j++) {
    if (newNodes[j].id === id) {return false;}
  }
  return true;
}

function filteredGraph(nodes, id) {
  let newNodes = [];
  let edgeList = [];

  newNodes.push(nodes[id]);

  doFromEdges(nodes, id, newNodes, edgeList);

  console.log(edgeList);
  console.log(newNodes);

  const newGraph = {
    'edges' : edgeList,
    'nodes' : newNodes,
  };

  console.log('nodelist:');
  for (let i = 0; i < newNodes.length; i++) {
    console.log(newNodes[i].id);
  }
  return newGraph;
}

//shitty output tests?
const graph = filteredGraph(nodes, 0);

console.log('GRAPH:');
console.log(graph);
//filteredGraph(nodes, 10)
//blech.forEach(console.log.bind(console));
//console.log(`output: ${blech[0].description}`);

export default filteredGraph;