import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import filteredGraph from '../utils/filterAlgortithm';
import GraphView from './GraphView';
import SearchbarDrawer from '../searchbar/SearchbarDrawer';
import FloatingActionButton from '../searchbar/FloatingActionButton';


function testUnique(array, item) {
  for (let j = 0; j < array.length; j++) {
    if (array[j] === item) {
      return false;
    }
  }
  return true;
}

export default class GraphViewAssembly extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: {'nodes': [], 'edges': []},
      selectedIDs: [],
    };
  }

  updateSelected(selection) {
    let graph = filteredGraph(this.props.data.nodes, selection);
    // Update colors
    selection.forEach( (selId) => {
      let needNewColorIndex = graph.nodes.findIndex( (i) => i.id === selId);
      // console.log(`selected: ${graph.nodes[needNewColorIndex].label}`);
      graph.nodes[needNewColorIndex].color = '#e04141';
    });
    this.setState({
      graphData: graph,
      selectedIDs: selection,
    });
  }

  selectNode(nodeId) {
    // Skip if id is already selected
    if (!testUnique(this.state.selectedIDs, nodeId)) {
      return;
    }
    // Add to selection + update graph
    let selected = this.state.selectedIDs.slice();
    selected.push(nodeId);
    this.updateSelected(selected);
  }

  deselectNode(nodeId) {
    const index = this.state.selectedIDs.findIndex( (element) => element === nodeId );
    let selected = this.state.selectedIDs.slice();
    selected.splice(index, 1);
    this.updateSelected(selected);
  }

  handleItemClick(nodeId, event) {
    this.selectNode(nodeId);
  }

  handleSelectedClick(nodeId, event) {
    this.deselectNode(nodeId);
  }


  render() {
    return (
      <div>
        <SearchbarDrawer
          courses={this.props.data.nodes}
          itemClick={(event, id) => this.handleItemClick(event, id)}
          selClick={(event, sel) => this.handleSelectedClick(event, sel)}
          selected={this.state.selectedIDs}
        />
        {<GraphView data={this.state.graphData}/>}
        {/*<FloatingActionButton buttonClick={() => {alert('hahaha');}}/>*/}
      </div>
    );
  }
}