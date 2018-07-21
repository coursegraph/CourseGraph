const nodes = [
  {
    'dept': 'CSE',
    'description': 'An introduction to the mathematical theory of computability. Formal languages. Finite automata and regular expression. Push-down automata and context-free languages. Computable or recursive functions: Turing machines, the halting problem. Undecidability. Credit not offered for both Math 166 and CSE 105. Equivalent to Math 166. ',
    'edges_from': [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
    ],
    'edges_to': [
      10,
    ],
    'id': 0,
    'label': 'CSE 105',
    'title': 'Theory of Computability (4)',
  },
  {
    'dept': 'CSE',
    'description': '',
    'edges_from': [],
    'edges_to': [
      0,
    ],
    'id': 1,
    'label': 'CSE 12',
    'title': '',
  },
  {
    'dept': 'CSE',
    'description': '',
    'edges_from': [],
    'edges_to': [
      0,
      10,
    ],
    'id': 2,
    'label': 'CSE 21',
    'title': '',
  },
  {
    'dept': 'CSE',
    'description': 'Wacko flaco',
    'edges_from': [],
    'edges_to': [
      0,
    ],
    'id': 3,
    'label': 'CSE 20',
    'title': '',
  },
  {
    'dept': 'MATH',
    'description': '',
    'edges_from': [],
    'edges_to': [
      0,
    ],
    'id': 4,
    'label': 'MATH 184',
    'title': '',
  },
  {
    'dept': 'CSE',
    'description': '',
    'edges_from': [],
    'edges_to': [
      0,
    ],
    'id': 5,
    'label': 'CSE 15L',
    'title': '',
  },
  {
    'dept': 'MATH',
    'description': '',
    'edges_from': [],
    'edges_to': [
      0,
    ],
    'id': 6,
    'label': 'MATH 100A',
    'title': '',
  },
  {
    'dept': 'MATH',
    'description': '',
    'edges_from': [],
    'edges_to': [
      0,
    ],
    'id': 7,
    'label': 'MATH 109',
    'title': '',
  },
  {
    'dept': 'MATH',
    'description': '',
    'edges_from': [],
    'edges_to': [
      0,
    ],
    'id': 8,
    'label': 'MATH 103A',
    'title': '',
  },
  {
    'dept': 'MATH',
    'description': '',
    'edges_from': [],
    'edges_to': [
      0,
    ],
    'id': 9,
    'label': 'MATH 15A',
    'title': '',
  },
  {
    'dept': 'CSE',
    'description': 'Topics include private and public-key cryptography, block ciphers, data encryption, authentication, key distribution and certification, pseudorandom number generators, design and analysis of protocols, zero-knowledge proofs, and advanced protocols. Emphasizes rigorous mathematical approach including formal definitions of security goals and proofs of protocol security. ',
    'edges_from': [
      0,
      2,
      11,
      12,
      13,
      14,
      15,
    ],
    'edges_to': [],
    'id': 10,
    'label': 'CSE 107',
    'title': 'Introduction to Modern Cryptography (4)',
  },
];

const links = [
  {
    'source': 1,
    'target': 0,
  },
  {
    'source': 2,
    'target': 0,
  },
  {
    'source': 3,
    'target': 0,
  },
  {
    'source': 4,
    'target': 0,
  },
  {
    'source': 5,
    'target': 0,
  },
  {
    'source': 6,
    'target': 0,
  },
];


function filteredGraph(nodes, id) {
  let to = [];
  let from = [];
  let nodesID = [];
  let edgeList = [];
  let n = nodes.length;

  nodesID.push(id);
  //let currentNode = nodes[id];
  //console.log(nodes[id].edges_from);
  //console.log(currentNode);
  if (id > n) {
    throw 'Selected Node is out of Range';
  }
  //console.log(id)

  for (let i = 0; i < nodes[id].edges_from.length; i++) {
    //console.log(currentNode)
    //console.log(nodes[id].edges_from);
    //console.log(id)
    if (nodes[id].edges_from[i] === undefined) {

    } else {
      from = nodes[id].edges_from[i];
      //to = nodes[id].edges_to[i];
      let edge_from = {from: from};
      let edge_to = {to: id};
      let edge = Object.assign(edge_from, edge_to);
      edgeList.push(edge);
      //console.log(`Edge_from: ${from[i]}`);
      nodesID.push(from);
      //console.log(`Edge_From: ${nodesID}`);
      //console.log(edgeList);
      filteredGraph(nodes, from);
    }
  }


  //console.log(nodes[id].edges_from.length)
  for (let x = 0; x < nodes[id].edges_to.length; x++) {
    if (nodes[id].edges_to[x] === undefined) {

    } else {
      to = nodes[id].edges_to[x];
      //console.log(to);
      let edge_from = {from: id};
      let edge_to = {to: to};
      let edge = Object.assign(edge_from, edge_to);
      edgeList.push(edge);
      nodesID.push(to);
      //filteredGraph(nodes, to);
      //console.log(`Edge_to: ${to}`);
    }
  }
  console.log(edgeList);
  console.log(`Node List: ${nodesID}`);
  //nodesID.map( x => filteredGraph(nodes, x));
  //let newArray = nodesID.map(x => filteredGraph(nodes, x));
  //console.log(`From: ${nodesID}`);


  /*newNodes.map( node => {
    nodes[id].edges_from.forEach( (from) =>
      edgeList.push( {from, id} )
    );
  });
  //edgeList.map( (x) => filteredGraph(nodes, edgeList.from));
  return edgeList;*/
}


//shitty output tests?
filteredGraph(nodes, 0);
//filteredGraph(nodes, 10)
//blech.forEach(console.log.bind(console));
//console.log(`output: ${blech[0].description}`);