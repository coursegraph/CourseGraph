import React from 'react';
import GraphView from '../graph/graph_view'
import Draggable from 'react-draggable';

class Searchbar extends React.Component {
  render () {
    return (
      <input type="text" onChange={this.props.onChange} />
    );
  }
}
class SearchResultList extends React.Component {
  render () {
    return (
      <div />
    );
  }
}

function match (q) {
  return (s) => {
    return true;
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
      <Draggable>
        <div>
          <Searchbar onChange={(search) => this.updateSearch(search)} />
          <SearchResultList courses={filteredData} />
        </div>
      </Draggable>
    );
  }
}

export default class GraphViewAssembly extends React.Component {
  render () {
    return (
      <div>
        <GraphView data={this.props.data} />
        <SearchbarAssembly courses={this.props.data.nodes} />
      </div>
    );
  }
}
