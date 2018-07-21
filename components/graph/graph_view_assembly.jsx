import React from 'react';
import GraphView from '../graph/graph_view';
import Draggable from 'react-draggable';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Tooltip from '../Tooltip';
import filteredGraph from '../utils/filterAlgortithm';

const lStyle = {
  overflow: 'auto',
  maxHeight: '800px',
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
    this.setState({ value: event.target.value });
    this.props.onChange(event.target.value);
  }

  render() {
    return (<input style={inStyle} type="search" value={this.value} onChange={this.onChange} placeholder="Search for Classes"/>
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

  onListScroll = (event) => {
    const el = document.getElementById('listDiv');

    if ( (el.scrollHeight - el.scrollTop) < 810 ) {
      let newVisibleElements = this.state.visibleElements + 40;
      this.setState({
        visibleElements: newVisibleElements});
    }
    //console.log(`max scroll height : ${el.scrollHeight}`);
    //console.log(`amount scrolled? : ${el.scrollTop}`);
  };


  render() {
    let courses = this.props.courses.slice(0, this.state.visibleElements);
    return (
      <div id='listDiv' style={lStyle} onScroll={this.onListScroll} >
        <List >{courses.map((course) => (
        //<Tooltip
        //trigger={
          <ListItem
            key={course.id}
            button
            onClick={this.props.click.bind(this, course.id)}
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

function fuzzyMatch(q, s) {
  let i = s.length;
  let j = q.length;
  while (j != 0 && i >= j) {
    if (s[i - 1] == q[j - 1]) {
      --j;
    }
    --i;
  }
  return j == 0;
}

function levenshtein(q, s, A, B) {
  let n = q.length;
  let m = s.length;

  A.length = n + 1;
  B.length = n + 1;
  for (let i = n + 1; i-- > 0;) {
    A[i] = i;
    B[i] = 0;
  }
  for (let j = 0; j < m; ++j) {
    let x = j;
    for (let i = 0; i < n; ++i) {
      x = B[i + 1] = Math.min(
        Math.min(x, A[i + 1]) + 1,
        q[i] != s[j] ? A[i] + 1 : 0);
    }
    let C = A; A = B; B = C;
  }
  return A[n];
}
// def lev (a, b):
//     n, m = len(a), len(b)
//     row, prev = [0] * (n + 1), [0] * (n + 1)
//     for i in range(n):
//         prev[i] = i
//     for j in range(m):
//         x = j
//         for i in range(n):
//             x = row[i + 1] = min(
//                 min(x, prev[i + 1]) + 1,
//                 prev[i] + 1 if a[i] != b[j] else 0)
//         row, prev = prev, row
//     return prev[n]

function match(q) {
  return (course) => {
    course.searchString = (course.label + course.title + course.descr).toLowerCase();
    return fuzzyMatch(q.toLowerCase(), course.searchString);
  };
}

class SearchbarAssembly extends React.Component {
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
        <SearchResultList courses={filteredData} click={(event, id) => this.props.click(event, id)}/>
      </div>
      // </Draggable>
    );
  }
}

class SearchbarDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen : false,
    };
  }
  toggleDrawer = (open) => () => {
    this.setState({
      isOpen: open,
    });
  };

  render() {
    const contents = this.props.courses;

    return (
      <div>
        <Button onClick={this.toggleDrawer(true)}>Open Search Bar</Button>
        <Drawer anchor="left" open={this.state.isOpen} onClose={this.toggleDrawer(false)}>
          <SearchbarAssembly courses={contents} click={ (event, id) => this.props.click(event, id)}/>
        </Drawer>
      </div>
    );
  }
}

export default class GraphViewAssembly extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      graphData: {"nodes" : [], "edges" : []},
    }
  }


  handleItemClick(id, event) {
    console.log(`course ID: ${id}`);
    const newGraph = filteredGraph(this.props.data.nodes, id);
    this.setState({
      graphData: newGraph,
    });
  }


  render() {
    return (
      <div>
        <SearchbarDrawer courses={this.props.data.nodes} click={ (event, id) => this.handleItemClick(event, id)}/>
        {<GraphView data={this.state.graphData}/>}
      </div>
    );
  }
}
