import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {levenshtein, match } from '../utils/levenshtien';

const leStyle = {
  overflow: 'auto',
  maxHeight: '400px',
  maxWidth: '300px',
};

const inStyle = {
  width: '250px',
  fontSize: '20px',
};

class Searchbar extends React.Component {
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

class SearchResultList extends React.Component {
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
    //console.log(`max scroll height : ${el.scrollHeight}`);
    //console.log(`amount scrolled? : ${el.scrollTop}`);
  };

  render() {
    let courses = this.props.courses.slice(0, this.state.visibleElements);
    return (
      <div id="listDiv" style={leStyle} onScroll={this.onListScroll}>
        <List>{courses.map((course) => (
          //<Tooltip
          //trigger={
          <ListItem
            key={course.id}
            button
            divider
            onClick={this.props.itemClick.bind(this, course.id)}
          >
            <ListItemText primary={`${course.label} ${course.title}`}/>
          </ListItem> //}
          /*content={
            <div>
              <h3>{`${course.title}`}</h3>
              <p>{`Instructor: ${course.instructor}`}</p>
              <p>{`Terms: ${course.terms}`}</p>
              <p>{`GE: ${course.geCategories}`}</p>
              <p>{`Division: ${course.division}`}</p>
              <p>{`Description: ${course.description}`}</p>
            </div>
          }
        /> */
        ))}</List>
      </div>
    );
    // <ListItemText primary={`${course.priority} ${course.label} ${course.title}`} />
  }
}

export default class SearchbarAssembly extends React.Component {
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
      // = levenshtein(course.searchString.toLowerCase(), searchQuery.toLowerCase(), this.tempArrayA, this.tempArrayB);
      // = levenshtein(course.label.toLowerCase(), searchQuery.toLowerCase(), this.tempArrayA, this.tempArrayB) * 10
      // + levenshtein(course.title.toLowerCase(), searchQuery.toLowerCase(), this.tempArrayA, this.tempArrayB) * 3
      // = levenshtein(searchQuery.toLowerCase(), course.label.toLowerCase(), this.tempArrayA, this.tempArrayB) * 10
      // + levenshtein(searchQuery.toLowerCase(), course.title.toLowerCase(), this.tempArrayA, this.tempArrayB) * 3


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