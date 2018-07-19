import React from 'react';
import GraphViewLoader from '../components/graph/graph_view_loader';

class GraphPage extends React.Component {
  render() {
    return <GraphViewLoader
      jsonDataUrl="https://raw.githubusercontent.com/coursegraph/coursegraph-data/master/ucsd/ucsd_graph_data.json"
    />;
  }
}

export default GraphPage;
