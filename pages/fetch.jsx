import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';

class Index extends React.Component {
  static propTypes = {
    courses: PropTypes.arrayOf(PropTypes.shape({
      course_title: PropTypes.string.isRequired,
    })),
  };

  static getInitialProps = async () => {
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
          {this.props.courses.map(({course_title}) => (
            <li key={course_title}>
              <a>{course_title}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Index;
