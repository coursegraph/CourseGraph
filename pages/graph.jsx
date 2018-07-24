import React from 'react';
import GraphViewLoader from '../components/graph/graph_view_loader';
import Header from '../components/Header';


class GraphPage extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <GraphViewLoader
          jsonDataUrl="https://raw.githubusercontent.com/coursegraph/coursegraph-data/master/ucsd/ucsd_graph_data.json"
        />
      </div>
    )
      ;
  }
}

export default GraphPage;
