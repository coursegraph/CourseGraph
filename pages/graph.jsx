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
  'automaticRearrangeAfterDropNode': true,
  'height': 800,
  'highlightDegree': 1,
  'highlightOpacity': 1,
  'linkHighlightBehavior': false,
  'maxZoom': 8,
  'minZoom': 0.1,
  'nodeHighlightBehavior': true,
  'panAndZoom': false,
  'staticGraph': true,
  'width': 800,
  'node': {
    'color': '#d3d3d3',
    'fontColor': 'black',
    'fontSize': 8,
    'fontWeight': 'normal',
    'highlightColor': 'SAME',
    'highlightFontSize': 8,
    'highlightFontWeight': 'normal',
    'highlightStrokeColor': 'SAME',
    'highlightStrokeWidth': 1.5,
    'labelProperty': 'id',
    'mouseCursor': 'pointer',
    'opacity': 1,
    'renderLabel': true,
    'size': 200,
    'strokeColor': 'none',
    'strokeWidth': 1.5,
    'svg': '',
    'symbolType': 'square',
  },
  'link': {
    'color': '#d3d3d3',
    'opacity': 1,
    'semanticStrokeWidth': false,
    'strokeWidth': 1.5,
    'highlightColor': '#d3d3d3',
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
