import React from 'react';
import PropTypes from 'prop-types';

import CourseInfo from '../components/CourseInfo';

class Posts extends React.Component {
  static propTypes = {
    courses: PropTypes.arrayOf(PropTypes.shape({
      course_title: PropTypes.string.isRequired,
    })),
  };

  static async getInitialProps({req, query}) {
    console.log(query);
  }

  render() {
    return (
      <div>
        <h1>Posts</h1>
        <CourseInfo/>
      </div>
    );
  }
}

export default Posts;
