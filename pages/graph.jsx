import React from 'react';
import { GraphViewApp } from '../components/graph/graph_view_app';

class GraphPage extends React.Component {
  render () {
    return <GraphViewApp 
      jsonDataUrl='https://raw.githubusercontent.com/coursegraph/coursegraph-data/master/ucsd/ucsd_graph_data_100.json' 
    />
  }
}

export default GraphPage;
