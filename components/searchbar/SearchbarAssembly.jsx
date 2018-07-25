import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

import { levenshtein, match } from '../utils/levenshtien';
import SearchResultList from './SearchResultList';
import SearchBar from './SearchBar';

const styles = theme => ({
  container: {
    'max-width': 300,
  },
});


class SearchbarAssembly extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    courses: PropTypes.array.isRequired,
  };

  state = {
    searchQuery: '',
  };

  tempArrayA = [];
  tempArrayB = [];

  updateSearch(search) {
    this.setState({
      searchQuery: search,
    });
  }

  render() {
    const {classes, courses} = this.props;

    const searchQuery = this.state.searchQuery;
    let filteredData = courses.filter(match(searchQuery));

    filteredData.forEach((course) => {
      course.priority = levenshtein(
        searchQuery.toLowerCase(),
        course.searchString.toLowerCase(),
        this.tempArrayA,
        this.tempArrayB
      );
    });

    filteredData.sort((a, b) => a.priority > b.priority);

    return (
      <div className={classes.container}>
        <SearchBar onChange={(search) => this.updateSearch(search)}/>
        <Divider/>
        <SearchResultList courses={filteredData}
                          itemClick={(event, id) => this.props.itemClick(event, id)}/>
      </div>
    );
  }
}

export default withStyles(styles)(SearchbarAssembly);
