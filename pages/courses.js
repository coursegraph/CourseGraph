import React from 'react';
import ListView from '../components/listView';
import PropTypes from 'prop-types';
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'


class CoursePage extends React.Component {
  constructor(props){
    super(props);
  }

  //data fetching segment
   static async getIntitialProps(){
    const res = await fetch('/_data/items', {headers: {'Accept': 'application/json'}});
    const json = await res.json();
    return {item: json};
  }

  render() {
    return (
      <ListView listdata={this.item}/>
    );
  }
}
//hardcoded that is passed down to listView
//const courseTitles = ['course 1', 'course 2', 'course 3', 'course 4'];

export default () => (
  <CoursePage />
)