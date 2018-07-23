import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { withStyles } from '@material-ui/core/styles';

import Particles from 'react-particles-js';

import Header from '../../components/Header';

const styles = theme => ({
  // body: {
  //   'margin': '0',
  //   'padding': '0',
  //   'background-color': '#2e3250',
  // },
  wrapper: {
    'height': '100vh',
    'width': '100vw',
    'line-height': '100vh',
    'text-align': 'center',
  },
});

/**
 * Search Page
 */
class IndexPage extends React.Component {
  static propTypes = {
    // resultsState: PropTypes.object,
    // searchState: PropTypes.object,
  };

  // static async getInitialProps(params) {
  //   return {resultsState, searchState};
  // }

  render() {
    return (
      <div className="wrapper">
        <Header/>
        <style>{'body { background-color: #2e3250; }'}</style>
        <Particles params={{
          particles: {
            'number': {
              'value': 40,
              'density': {
                'enable': true,
                'value_area': 800,
              },
            },
            'color': {
              'value': '#ffffff',
            },
            'opacity': {
              'value': 0.5,
              'random': false,
              'anim': {
                'enable': false,
                'speed': 1,
                'opacity_min': 0.1,
                'sync': false,
              },
            },
          },
        }}/>
      </div>
    );
  }
}

export default withStyles(styles)(IndexPage);
