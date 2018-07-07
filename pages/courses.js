import React from 'react';
import ListView from '../components/listView';

class CoursePage extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <ListView listdata={this.props.listdata}/>
    );
  }
}

const courseTitles = ['course 1', 'course 2', 'course 3', 'course 4'];

export default () => (
  <CoursePage listdata={courseTitles}/>
)