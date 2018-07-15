import React from 'react';
import { Graph } from 'react-d3-graph';

// graph payload (with minimalist structure)
const data = {
  nodes: [{id: 'Harry'}, {id: 'Sally'}, {id: 'Alice'}],
  links: [{source: 'Harry', target: 'Sally'}, {
    source: 'Harry',
    target: 'Alice',
  }],
};

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
  nodeHighlightBehavior: true,
  node: {
    color: 'lightgreen',
    size: 120,
    highlightStrokeColor: 'blue',
  },
  link: {
    highlightColor: 'lightblue',
  },
};

// graph event callbacks
const onClickNode = (nodeId) => {
};

const onMouseOverNode = (nodeId) => {
};

const onMouseOutNode = (nodeId) => {
};

const onClickLink = (source, target) => {
};

const onMouseOverLink = (source, target) => {
};

const onMouseOutLink = (source, target) => {
};

export default () => {
  return (<Graph
    id="graph-id"
    data={data}
    config={myConfig}
    onClickNode={onClickNode}
    onClickLink={onClickLink}
    onMouseOverNode={onMouseOverNode}
    onMouseOutNode={onMouseOutNode}
    onMouseOverLink={onMouseOverLink}
    onMouseOutLink={onMouseOutLink}
  />);
};
