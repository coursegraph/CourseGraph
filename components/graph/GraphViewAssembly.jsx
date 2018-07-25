import React, { Component } from 'react';
import PropTypes from 'prop-types';

import filteredGraph from '../utils/filterAlgortithm';
import GraphView from './GraphView';
import SearchbarDrawer from '../searchbar/SearchbarDrawer';

/**
 * GraphViewAssembly renders both drawers and the graph view. Takes a prop
 * data. Which is the graph data of a school.
 */
class GraphViewAssembly extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  state = {
    graphData: {'nodes': [], 'edges': []},
    selectedIDs: [],
  };

  /**
   * @param selection
   */
  updateSelected(selection) {
    const {data} = this.props;

    let graph = filteredGraph(data.nodes, selection);

    // Update colors
    // selection.forEach((selId) => {
    //   let needNewColorIndex = graph.nodes.findIndex((i) => i.id === selId);
    //   graph.nodes[needNewColorIndex].color = '#e04141';
    // });

    this.setState({
      graphData: graph,
      selectedIDs: selection,
    });
  }

  /**
   * @param nodeId {string} ? number I forgot
   */
  selectNode(nodeId) {
    const {selectedIDs} = this.state;

    // Skip if id is already selected
    if (selectedIDs.includes(nodeId)) {
      return;
    }

    // Add to selection + update graph
    let selected = selectedIDs.slice();
    selected.push(nodeId);
    this.updateSelected(selected);
  }

  /**
   * @param nodeId {string} ? number I forgot
   */
  deselectNode(nodeId) {
    const {selectedIDs} = this.state;

    const index = selectedIDs.findIndex((element) => element === nodeId);
    let selected = selectedIDs.slice();
    selected.splice(index, 1);
    this.updateSelected(selected);
  }

  /**
   * WTF ????
   * @param nodeId
   * @param event
   */
  handleItemClick(nodeId, event) {
    this.selectNode(nodeId);
  }

  /**
   * WTF ????
   * @param nodeId
   * @param event
   */
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
        <GraphView data={this.state.graphData}/>
      </div>
    );
  }
}

export default GraphViewAssembly;
