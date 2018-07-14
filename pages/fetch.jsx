import React from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

class Index extends React.Component {
  static getInitialProps = async () => {
    // const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
    const res = await fetch('http://coursegraph.org/api/courses');
    const data = await res.json();

    console.log(`Show data fetched. Count: ${data.length}`);

    return {
      courses: data,
    };
  };

  render() {
    return (
      <div>
        <h1>UCSC Courses</h1>
        <ul>
          {this.props.courses.map(({show}) => (
            <li key={show.time}>
              <a>{show.time}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Index;
