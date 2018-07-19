import React from 'react';
import Graph from 'react-graph-vis';

import { SearchBox } from 'react-instantsearch/dom';
import { InstantSearch } from '../components/Instantsearch';
import fetch from 'isomorphic-unfetch';

const options = {
  layout: {
    hierarchical: {
      enabled: false,
    },
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
  layout: {
    improvedLayout: true,
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

class GraphPage extends React.Component {
  static async getInitialProps() {
    const res = await fetch('https://raw.githubusercontent.com/coursegraph/coursegraph-data/master/ucsd/ucsd_graph_data_100.json');
    const data = await res.json();

    console.log(`Show data fetched. Count: ${data.nodes.length}`);
    console.log(`Show data fetched. Count: ${data.edges.length}`);

    return {
      graph: data,
    };
  }

  render() {
    return (<div>
      <InstantSearch
        appId="FCQTNAVIWA"
        apiKey="c8a69c0f0dace8e66ba72fa55e730685"
        indexName="courses"
      >
        <SearchBox/>
      </InstantSearch>
      <Graph graph={this.props.graph}
             options={options}
             events={events}
      />
    </div>);
  }
}

export default GraphPage;
