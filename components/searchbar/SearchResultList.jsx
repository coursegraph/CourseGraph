import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

/**
 * Define the style of components on this page
 * @param theme
 * @return {object}
 */
const styles = theme => ({
  listdiv: {
    overflow: 'auto',
    maxHeight: '400px',
    maxWidth: '300px',
  },
});

/**
 * List container that display the search result
 */
class SearchResultList extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    courses: PropTypes.array.isRequired,
  };

  state = {
    visibleElements: 40,
  };

  // This is here because it needs to get scrollHeight and scrollTop of a div,
  // taken any higher this is not possible.
  onListScroll = (event) => {
    const el = document.getElementById('listDiv'); // WTF????????

    if ((el.scrollHeight - el.scrollTop) < 810) {
      let newVisibleElements = this.state.visibleElements + 40;
      this.setState({
        visibleElements: newVisibleElements,
      });
    }
  };

  render() {
    const {classes} = this.props;

    let courses = this.props.courses.slice(0, this.state.visibleElements);

    return (
      <div id="listDiv" className={classes.listdiv}
           onScroll={this.onListScroll}>
        <List>{courses.map((course) => (
          <ListItem
            key={course.id}
            button
            divider
            onClick={this.props.itemClick.bind(this, course.id)}
          >
            <ListItemText primary={`${course.label} ${course.title}`}/>
          </ListItem>
        ))}</List>
      </div>
    );
  }
}

export default withStyles(styles)(SearchResultList);
