import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles/index';

/**
 * Define the style of components on this page
 * @param theme
 * @return {object}
 */
const styles = theme => ({
  select: {
    maxWidth: '300px',
    overflow: 'auto',
    maxHeight: '300px',
  },
  text: {
    fontSize: 10,
  },
});

/**
 * Generate a list of <Chip> Elements
 * @param classes
 * @param courses
 * @param selClick
 * @param selected
 * @return {Element}
 */
const createChips = (classes, courses, selClick, selected) =>
  selected.map((course) => (
    <Chip
      className={classes.text}
      key={course}
      label={courses[course].label}
      onDelete={selClick.bind(this, course)}
    />
  ));

/**
 * An Chip container that user can select and deselect nodes on the graph
 */
class SelectedList extends Component {
  static propTypes = {
    classes: PropTypes.object,
    courses: PropTypes.array.isRequired,
    selClick: PropTypes.func.isRequired,
    selected: PropTypes.array.isRequired,
  };

  render() {
    const {classes, courses, selClick, selected} = this.props;

    return (
      <div className={classes.select}
           onScroll={this.onListScroll}
      >
        <Paper>
          {createChips(classes, courses, selClick, selected)}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SelectedList);
