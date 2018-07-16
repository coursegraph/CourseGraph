import React from 'react';
import Graph from 'react-graph-vis';

import { SearchBox } from 'react-instantsearch/dom';
import { InstantSearch } from '../components/Instantsearch';

const graph = {
  nodes: [
    {id: 1, label: 'Node 1'},
    {id: 2, label: 'Node 2'},
    {id: 3, label: 'Node 3'},
    {id: 4, label: 'Node 4'},
    {id: 5, label: 'Node 5'},
  ],
  edges: [
    {from: 1, to: 2},
    {from: 1, to: 3},
    {from: 2, to: 4},
    {from: 2, to: 5},
  ],
};

const options = {
  layout: {
    hierarchical: false,
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
};

const events = {
  select: (event) => {
    let {nodes, edges} = event;
  },
};

export default () => {
  return (<div>
    <InstantSearch
      appId="FCQTNAVIWA"
      apiKey="c8a69c0f0dace8e66ba72fa55e730685"
      indexName="courses"
    >
      <SearchBox/>
    </InstantSearch>
    <Graph graph={graph}
           options={options}
           events={events}
    />
  </div>);
};
