import React from 'react';
import { GraphView } from '../components/graph/graph_view'
import { SearchBox } from 'react-instantsearch/dom';
import { InstantSearch } from '../components/Instantsearch';
import fetch from 'isomorphic-unfetch';


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
      <GraphView data={this.props.graph} />
    </div>);
  }
}

export default GraphPage;
