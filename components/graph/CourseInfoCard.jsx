import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
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
    'maxHeight': 600,
    'position': 'absolute',
    'margin-left': 'auto',
    'margin-right': 'auto',
    'z-index': 100,
    'top': theme.spacing.unit * 15,
    'right': theme.spacing.unit * 10,
    'transform': `translateY(-${50}%)`,
  },
});

/**
 * @param classes {object}
 * @param title {string}
 * @param description {string}
 * @return {Element}
 * @constructor
 */
const CourseInfoCard = ({classes, title, description}) => {
  return (
    <Card className={classes.panel}>
      <CardContent>
        <Typography gutterBottom variant="headline"
                    component="h1"> {title} </Typography>
        <Typography component="p"> {description} </Typography>
      </CardContent>
    </Card>
  );
};

CourseInfoCard.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

CourseInfoCard.defaultProps = {
  title: 'Untitled',
  description: 'Unavailable',
};

export default withStyles(styles)(CourseInfoCard);
