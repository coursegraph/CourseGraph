import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Particles from 'react-particles-js';

import Header from '../components/Header';
import HomePanel from '../components/home/HomePanel';

/**
 * Define the style of components on this page
 * @param theme
 * @return {object}
 */
const styles = theme => ({
  wrapper: {
    'text-align': 'center',
  },
});

/**
 * Define the 'particle-js' setting on the background
 * @type {object}
 */
const particleParams = {
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
};

/**
 * Home Page
 */
class IndexPage extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.wrapper}>
        <Header/>
        <style>{'body { background-color: #2e3250; }'}</style>
        <HomePanel/>
        <Particles params={particleParams}/>
      </div>
    );
  }
}

export default withStyles(styles)(IndexPage);
