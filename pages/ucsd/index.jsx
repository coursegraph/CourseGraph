import React from 'react';
import PropTypes from 'prop-types';

import GraphViewAssembly from '../../components/graph/graph_view_assembly';
import Header from '../../components/Header';

import fetch from 'isomorphic-unfetch';

class GraphPage extends React.Component {
  static propTypes = {
    graphData: PropTypes.object,
  };

  /**
   * @param req
   * @param query
   * @return {Promise<*>}
   */
  static async getInitialProps({req, query}) {
    const isServer = !!req;

    const URL = 'https://raw.githubusercontent.com/coursegraph/coursegraph-data/master/ucsd/ucsd_graph_data.json';

    if (isServer) {
      console.log(query.itemData.edges.length);
      return {graphData: query.itemData};
    } else {
      const res = await fetch(URL, {
        headers: {'Accept': 'application/json'},
      });
      const json = await res.json();
      return {graphData: json};
    }
  }

  render() {
    return (
      <div>
        <Header/>
        <GraphViewAssembly data={this.props.graphData}/>
      </div>
    );
  }
}

export default GraphPage;
