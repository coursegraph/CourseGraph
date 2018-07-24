import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { levenshtein, match } from '../utils/levenshtien';

const leStyle = {
  overflow: 'auto',
  maxHeight: '400px',
  maxWidth: '300px',
};

const inStyle = {
  width: '250px',
  fontSize: '20px',
};

class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({value: event.target.value});
    this.props.onChange(event.target.value);
  }

  render() {
    return (<input style={inStyle} type="search" value={this.value}
                   onChange={this.onChange} placeholder="Search for Classes"/>
    );
  }
}

class SearchResultList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleElements: 40,
    };
  }

  //This is here because it needs to get scrollHeight and scrollTop of a div, taken any higher this is not possible.
  onListScroll = (event) => {
    const el = document.getElementById('listDiv');

    if ((el.scrollHeight - el.scrollTop) < 810) {
      let newVisibleElements = this.state.visibleElements + 40;
      this.setState({
        visibleElements: newVisibleElements,
      });
    }
  };

  render() {
    let courses = this.props.courses.slice(0, this.state.visibleElements);
    return (
      <div id="listDiv" style={leStyle} onScroll={this.onListScroll}>
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

export default class SearchbarAssembly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
    };
    this.tempArrayA = [];
    this.tempArrayB = [];
  }

  updateSearch(search) {
    this.setState({
      searchQuery: search,
    });
  }

  render() {
    const courses = this.props.courses;
    const searchQuery = this.state.searchQuery;
    let filteredData = courses.filter(match(searchQuery));
    filteredData.forEach((course) => {
      course.priority
        = levenshtein(searchQuery.toLowerCase(), course.searchString.toLowerCase(), this.tempArrayA, this.tempArrayB);
    });
    filteredData.sort((a, b) => a.priority > b.priority);

    return (
      //<Draggable>
      <div>
        <Searchbar onChange={(search) => this.updateSearch(search)}/>
        <SearchResultList courses={filteredData}
                          itemClick={(event, id) => this.props.itemClick(event, id)}/>
      </div>
      // </Draggable>
    );
  }
}
