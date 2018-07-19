import React from 'react';
import GraphView from '../graph/graph_view'
import Draggable from 'react-draggable';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


class Searchbar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: ""
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange (event) {
    this.setState({ value: event.target.value });
    this.props.onChange(event.target.value);
  }
  render () {
    return (
        <input type="search" 
          value={this.value} 
          onChange={this.onChange}
        />
    );
  }
}
class SearchResultList extends React.Component {
  render () {
    let courses = this.props.courses;
    return (
      <List>{courses.slice(0,100).map((course) => (
        <ListItem key={course.id}>
          <ListItemText primary={`${course.label} ${course.title}`} />
        </ListItem>
      ))}</List>
    );
  }
}

function fuzzyMatch (q, s) {
  let i = s.length;
  let j = q.length;
  while (j != 0 && i >= j) {
    if (s[i-1] == q[j-1]) {
      --j;
    }
    --i;
  }
  return j == 0;
}
function match (q) {
  return (course) => {
    return fuzzyMatch(q.toLowerCase(), (course.label + course.title + course.descr).toLowerCase());
  };
}



class SearchbarAssembly extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      searchQuery: ''
    };
  }
  updateSearch (search) {
    this.setState({
      searchQuery: search
    });
  }
  render () {
    const courses = this.props.courses;
    const searchQuery = this.state.searchQuery;
    const filteredData = courses.filter(match(searchQuery));
    return (
      //<Draggable>
        <div>
          <Searchbar onChange={(search) => this.updateSearch(search)} />
          <SearchResultList courses={filteredData} />
        </div>
      // </Draggable>
    );
  }
}

export default class GraphViewAssembly extends React.Component {
  render () {
    return (
      <div>
        <SearchbarAssembly courses={this.props.data.nodes} />
        {/*<GraphView data={this.props.data} />*/}
      </div>
    );
  }
}
