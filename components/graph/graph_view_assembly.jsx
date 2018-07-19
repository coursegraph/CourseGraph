import React from 'react';
import { GraphView } from '../graph/graph_view'


export class GraphViewAssembly extends React.Component {
  render () {
    return (
      <div>
        <GraphView data={this.props.data} /> 
      </div>
    );
  }
}
