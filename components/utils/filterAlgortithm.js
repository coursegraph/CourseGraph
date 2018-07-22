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
    'description' : 'question mark',
    'edges_from' : [],
    'edges_to' : [],
    'id' : 9,
    'label' : 'whatevs',
    'title' : 'whatevs',
  },
];

function doFromEdges(nodes, id, newNodes, newEdges, froms) {
  const edgesFrom = nodes[id].edges_from;

  edgesFrom.forEach((fromID) => {
    newEdges.push({
      'from': fromID,
      'to': id,
    });
    if (testUnique(newNodes, fromID)) {
      newNodes.push(fromID);
      newNodes[newNodes.length - 1].color = '#89C4F4';
    }
    if (testUnique(froms, fromID)) {
      froms.push(fromID);
      doFromEdges(nodes, fromID, newNodes, newEdges, froms);
    }
  });
}

function doToEdges(nodes, id, newNodes, newEdges, tos) {
  const edgesTo = nodes[id].edges_to;

  edgesTo.forEach((toID) => {
    newEdges.push({
      'from': id,
      'to': toID,
    });
    if (testUnique(newNodes, toID)) {
      newNodes.push(toID);
      newNodes[newNodes.length - 1].color = '#89C4F4';
    }
    if (testUnique(tos, toID)) {
      tos.push(toID);
      doToEdges(nodes, toID, newNodes, newEdges, tos);
    }
  });
}

function testUnique(newNodes, id) {
  for (let j = 0; j < newNodes.length; j++) {
    if (newNodes[j] === id) {return false;}
  }
  return true;
}

/**
 * @param nodes {Array.<object>} the entire data set
 * @param ids {Array.<number>}
 * @param getFrom {boolean} if true returns all from connections (default true)
 * @param getTo {boolean} if true returns all to connections (default false)
 */
function filteredGraph(nodes, ids, getFrom = true, getTo) {
  let froms = [];
  let tos = [];
  let newNodes = [];
  let edgeList = [];

  ids.forEach( (id) => {
    if (testUnique(newNodes, id)) { newNodes.push(id); }

    if (getFrom && testUnique(froms, id)) {
      froms.push(id);
      doFromEdges(nodes, id, newNodes, edgeList, froms);
    }
    if (getTo && testUnique(tos, id)) {
      tos.push(id);
      doToEdges(nodes, id, newNodes, edgeList, tos);
    }
  });


  //console.log(edgeList);
  //console.log(newNodes);
  const graphNodes = [];
  newNodes.forEach( (id) => graphNodes.push(nodes[id]) );
  const newGraph = {
    'edges' : edgeList,
    'nodes' : graphNodes,
  };
  /*
  console.log('nodelist:');
  console.log(newNodes);
  console.log('edges');
  console.log(edgeList);
  console.log('froms');
  console.log(froms);
  console.log('tos');
  console.log(tos);
  */
  return newGraph;
}

//shitty output tests?
//const graph = filteredGraph(nodes, [0]);

//console.log('GRAPH:');
//console.log(graph);
//filteredGraph(nodes, 10)



export default filteredGraph;