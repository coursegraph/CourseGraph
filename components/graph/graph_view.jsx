import React from 'react';
import Graph from 'react-graph-vis';
import fetch from 'isomorphic-unfetch';

const options = {
  layout: {
    hierarchical: {
      enabled: false,
    },
    improvedLayout: true,
  },
  edges: {
    color: '#000000',
  },
  width: '100%',
  height: '800px',
  autoResize: true,
  nodes: {
    shape: 'box',
    color: '#89C4F4',
  },
  physics: {
    solver: 'forceAtlas2Based',
    adaptiveTimestep: true,
    // barnesHut: {
    //   avoidOverlap: 0.75,
    // },
    stabilization: {
      enabled: true,
      iterations: 100,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true,
    },
  },
};

const events = {
  select: (event) => {
    let {nodes, edges} = event;
  },
};

export class GraphView extends React.Component {
  render () {
    return (
      <Graph graph={this.props.data}
           options={options}
           events={events}
      />
    );
  }
}
