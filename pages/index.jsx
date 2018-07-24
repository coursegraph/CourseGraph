import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Link from 'next/link';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Particles from 'react-particles-js';

import Header from '../components/Header';

/**
 * Define the style of components on this page
 * @param theme
 * @return {object}
 */
const styles = theme => ({
  wrapper: {
    'text-align': 'center',
  },
  panel: {
    'maxWidth': 350,
    'position': 'absolute',
    'margin-left': 'auto',
    'margin-right': 'auto',
    'left': 0,
    'right': 0,
    'z-index': 100,
    'top': '50%',
    'transform': `translateY(-${50}%)`,
  },
  button: {
    'margin': 'auto',
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
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  /**
   * @param href {string}
   * @return {Function}
   */
  onClickHandler(href) {
    return (e) => {
      e.preventDefault();
      Router.push(href);
    };
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.wrapper}>
        <Header/>
        <style>{'body { background-color: #2e3250; }'}</style>
        <Card className={classes.panel}>
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              Course Graph
            </Typography>
            <Typography>
              v2.0.0
            </Typography>
            <Typography component="p">
              🏅 A dynamic, browser based visualization course planner.
              Designed to help students with course planning.
            </Typography>
            <CardActions>
              <Button className={classes.button}
                      variant="contained"
                      onClick={this.onClickHandler('/ucsc')}
              >
                UC <br/>
                Santa Cruz
              </Button>
              <Button className={classes.button}
                      variant="contained"
                      onClick={this.onClickHandler('/ucsd')}
              >
                UC <br/>
                San Diego
              </Button>
            </CardActions>
          </CardContent>
        </Card>
        <Particles params={particleParams}/>
      </div>
    );
  }
}

export default withStyles(styles)(IndexPage);
