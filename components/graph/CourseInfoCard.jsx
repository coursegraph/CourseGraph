import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
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
    // 'position': 'absolute',
    'margin-left': 'auto',
    'margin-right': 'auto',
    'z-index': 100,
    'top': theme.spacing.unit * 25,
    'right': theme.spacing.unit * 10,
  },
});

/**
 * @param classes {object}
 * @param label {string}
 * @param title {string}
 * @param description {string}
 * @return {Element}
 * @constructor
 */
const CourseInfoCard = ({classes, label, title, description}) => {
  return (
    <Card className={classes.panel}>
      <CardHeader title={title || 'Untitled'} subheader={label}/>
      <CardContent>
        <Typography component="p"> {description || 'Unavailable'} </Typography>
      </CardContent>
    </Card>
  );
};

CourseInfoCard.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

CourseInfoCard.defaultProps = {
  title: 'Untitled',
  description: 'Unavailable',
  label: '- --',
};

export default withStyles(styles)(CourseInfoCard);
