import React from 'react';
import PropTypes from 'prop-types';

class CourseInfo extends React.Component {
  static propTypes = {
    info: PropTypes.shape({
      course_title: PropTypes.string.isRequired,
      course_number: PropTypes.number.isRequired,
      instructor: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      enrolled: PropTypes.number.isRequired,
      book: PropTypes.string.isRequired,
      course_url: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    info: {
      course_title: 'Empty',
      course_number: 0,
      instructor: 'Professor',
      location: 'UCSC',
      time: 'some times',
      enrolled: 0,
      book: 'textbook',
      course_url: 'null',
    },
  };

  static async getInitialProps({req, query}) {

    console.log(query);

    const isServer = !!req;

    if (isServer) {
      return {info: query.itemData};
    } else {
      const res = await fetch('https://coursegraph.org/api/courses');
      const json = await res.json();
      return {info: json};
    }
  }

  render() {
    return (
      <div className="Course">
        <h3>
          {this.props.info.title}
        </h3>
        <a>{this.props.info.course_number} by {this.props.info.instructor}</a>
      </div>
    );
  }
}

export default CourseInfo;
