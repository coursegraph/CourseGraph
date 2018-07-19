import React from 'react';
import GraphView from '../graph/graph_view'
import PopMenu from '../PopMenu'

export default class GraphViewAssembly extends React.Component {
  doFilter () {}
  render () {
    return (
      <div>
        <GraphView data={this.props.data} /> 
        <PopMenu array={this.props.data.nodes} 
                filter={(event)=>{
                  this.doFilter()}
                  } />
      </div>
    );
  }
}
