import React from 'react';
import Graph from 'react-graph-vis';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Tooltip from '@material-ui/core/Tooltip';


const options = {
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
  height: '800px',
  autoResize: true,
  nodes: {
    shape: 'box',
    color: '#89C4F4',
  },
  physics: {
    solver: 'forceAtlas2Based',
    adaptiveTimestep: true,
    // barnesHut: {
    //   avoidOverlap: 0.75,
    // },
    stabilization: {
      enabled: true,
      iterations: 100,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true,
    },
  },
  interaction: {
    hover:true,
    hoverConnectedEdges: false,
  },
};

const mStyles = {
  modal: {
    position: 'absolute',
    top: 350,
    left: 700,
    width: 500,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
    top: 10,
    color: 'black',
    padding: 5,
  },
  content: {
    fontSize: 14,
    top: 5,
    color: 'black',
    padding: 5,
  },
};

const tStyles = {
  tooltip: {
    position: 'relative',
    overflow: 'hidden',
    maxWidth: 300,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 14,
    color: 'black',
    padding: 5,
  },
  content:{
    fontSize: 12,
    color: 'black',
    padding: 5,
  },
};

export default class GraphView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toolOpen: false,
      toolNode: '',
      popOpen: false,
      popNode: '',
    };
  }

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
        return;
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
      this.setState({ popOpen: true });
      this.setState({ popNode: this.getNode(nodes) });
      //console.log(`double clicked nodes: ${nodes}`);
      // console.log(this.getNode(nodes));
      // const myId = this.getNode(nodes);
      // this.setState({nodeId: myId});
    },
    click: () => {
      this.setState({ popOpen: false });
    },
    hoverNode: (event) => {
      let {node} = event;
      this.setState({ toolOpen: true });
      this.setState({ toolNode: this.getNode(node) });
    },
    blurNode: () => {
      this.setState({ toolOpen: false });
    },
  };

  render() {
    return (
      <div>
        <Graph graph={this.props.data}
          options={options}
          events={this.events}
        />
        <Modal aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.popOpen} onClose={this.events.click}>
          <div style={mStyles.modal}>
            <Typography style={mStyles.title} id="modal-title">
              <br />
              {this.state.popNode.title}
            </Typography>
            <Typography style={mStyles.content} id="simple-modal-description">
              <p>{`Instructor: ${this.state.popNode.instructor}`}</p>
              <p>{`Terms: ${this.state.popNode.terms}`}</p>
              <p>{`GE: ${this.state.popNode.geCategories}`}</p>
              <p>{`Division: ${this.state.popNode.division}`}</p>
              <p>{`Description: ${this.state.popNode.description}`}</p>
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

