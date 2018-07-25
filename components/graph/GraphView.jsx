import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';

import { withStyles } from '@material-ui/core/styles';

/**
 * Define the style of components on this page
 * @param theme
 * @return {object}
 */
const styles = theme => ({
  fullpage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    'z-index': -1,
  },
});

/**
 * vis.js graph configuration setting
 * @type {object}
 */
const options = {
  groups: {
    useDefaultGroups: true,
    myGroupId: {
      /*node options*/
    },
  },
  layout: {
    hierarchical: {
      enabled: false,
    },
    improvedLayout: true,
  },
  edges: {
    color: '#000000',
  },
  width: '100%',
  height: '100%',
  autoResize: true,
  nodes: {
    shape: 'box',
    color: '#89C4F4',
    shapeProperties: {
      borderRadius: 0,     // only for box shape
    },
  },
  physics: {
    solver: 'forceAtlas2Based',
    adaptiveTimestep: true,
    stabilization: {
      enabled: true,
      iterations: 1,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true,
    },
  },
  interaction: {
    hover: true,
    hoverConnectedEdges: false,
  },
};

/**
 * @param dept {string} the Department name
 * @return {object}
 */
const generateGroupObject = (dept) => {
  // gen random color

  return {
    color: {background: 'red'},
  };
};

/**
 * Takes the raw data received from the server, 'parser' it to add additional
 * properties to the nodes.
 * @param rawData
 * @return {{data: object, departments: Set}}
 */
function parseGraphData(rawData) {
  let graph = Object.assign({}, rawData);
  let depts = new Set();

  graph.nodes.forEach((node) => {
    node.group = node.dept;
    depts.add(node.dept);
  });

  return {graph, depts};
}

/**
 * Wrapper to the Vis.js Graph. Handle additional Events.
 */
class GraphView extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    toolOpen: false,
    toolNode: '',
    popOpen: false,
    popNode: '',
  };

  /**
   * @param id
   * @returns {object}
   */
  getNode(id) {
    let arr = this.props.data.nodes;
    let result = null;

    arr.forEach((node) => {
      if (node.id == id) { // must use '==' instead of '==='
        result = node;

      }
    });

    return result;
  }

  events = {
    select: (event) => {
      let {nodes, edges} = event;
    },
    doubleClick: (event) => {
      let {nodes} = event;
      this.setState({popOpen: true});
      this.setState({popNode: this.getNode(nodes)});
    },
    click: () => {
      this.setState({popOpen: false});
    },
    hoverNode: (event) => {
      let {node} = event;
      this.setState({toolOpen: true});
      this.setState({toolNode: this.getNode(node)});
    },
    blurNode: () => {
      this.setState({toolOpen: false});
    },
  };

  render() {
    const {classes, data} = this.props;

    // Modify the graphData before passing to child component.
    const {graph, depts} = parseGraphData(data);

    // Must inject the groups data into the options.
    for (const department of depts) {
      options.groups.myGroupId[department] = generateGroupObject(department);
    }

    return (
      <div>
        <div className={classes.fullpage}>
          <Graph graph={graph}
                 options={options}
                 events={this.events}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(GraphView);
