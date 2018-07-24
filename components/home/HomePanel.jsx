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

/**
 * Define the style of components on this page
 * @param theme
 * @return {object}
 */
const styles = theme => ({
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
 * @param href {string}
 * @return {Function}
 */
function onClickHandler(href) {
  return (e) => {
    e.preventDefault();
    Router.push(href);
  };
}

/**
 * @param classes
 * @return {Element}
 * @constructor
 */
const HomePanel = ({classes}) => {
  return (
    <Card className={classes.panel}>
      <CardContent>
        <Typography gutterBottom variant="headline" component="h1">
          Course Graph
        </Typography>
        <Typography component="p">
          v2.0.0
        </Typography>
        <Typography component="p">
          🏅 A dynamic, browser based visualization course planner.
          Designed to help students with course planning.
        </Typography>
        <CardActions>
          <Link href="/ucsc">
            <Button className={classes.button}
                    onClick={onClickHandler}
                    variant="contained">
              UC <br/> Santa Cruz
            </Button>
          </Link>
          <Link prefetch href="/ucsd">
            <Button className={classes.button}
                    onClick={onClickHandler}
                    variant="contained">
              UC <br/> San Diego
            </Button>
          </Link>
        </CardActions>
      </CardContent>
    </Card>
  );
};

HomePanel.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(HomePanel);
