import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';

import { withStyles } from '@material-ui/core/styles';

import GraphViewAssembly from '../../components/graph/GraphViewAssembly';
import Header from '../../components/Header';

/**
 * Define the style of components on this page
 * @param theme
 * @return {object}
 */
const styles = theme => ({
  wrapper: {
    'text-align': 'center',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
});

class GraphPage extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    graphData: PropTypes.object.isRequired,
  };

  /**
   * @param req
   * @param query
   * @return {Promise<*>}
   */
  static async getInitialProps({req, query}) {
    const isServer = !!req;

    const URL = 'http://localhost:8080/api/graph-data/ucsd';

    if (isServer) {
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
    const {classes, graphData} = this.props;

    return (
      <div>
        <Header/>
        <style>{'body { background-color: #ECF0F1; }'}</style>
        <GraphViewAssembly data={graphData}/>
      </div>
    );
  }
}

export default withStyles(styles)(GraphPage);
