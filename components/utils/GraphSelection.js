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

  AddNodes(nodes, ids) {
    buildGraph(nodes, ids, this.nodeMap, this.edgeMap);
  }

  removeNodes(ids) {
    cleanGraph(ids, this.nodeMap, this.edgeMap);
  }

  getGraphData(){
    const graphData = {
      edges: this.edgeMap.values(),
      nodes: this.nodeMap.values(),
    };
    return graphData;
  }



}



function addFromEdges(nodes, id, nodeMap, edgeMap) {
  const edgesFrom = nodes[id].edges_from;

  edgesFrom.forEach((fromID, index) => {
    //Give every edge a unique key
    edgeMap.set(
      `${fromID}_${index}`,
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
}

function cleanFromEdges(id, nodeMap, edgeMap) {
  const edgesFrom = nodeMap.get(id).edges_from;
  nodeMap.delete(id);

  //Delete edges by their unique key
  edgesFrom.forEach((fromID, index) => {
    edgeMap.delete(`${fromID}_${index}`);
    if (nodeMap.delete(fromID)) {
      cleanFromEdges(fromID, nodeMap, edgeMap);
    }
  });

}

function cleanGraph(ids, nodeMap, edgeMap) {
  if (typeof (ids) === 'number') {
    if (!nodeMap.has(ids)){
      cleanFromEdges(ids, nodeMap, edgeMap);
    }
  } else {
    ids.forEach( (id) => {
      if (!nodeMap.has(id)) {
        cleanFromEdges(id, nodeMap, edgeMap);
      }
    });
  }
}


