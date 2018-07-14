import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Course from '../components/Course';
import List from '../components/List';
import { fetchCourses } from '../actions';

/**
 * @constructor
 * @extends {Component}
 */
class CoursePage extends React.Component {
  static propTypes = {
    courses: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number.isRequired,
    // dispatch: PropTypes.func.isRequired,
  };
  static defaultProps = {
    isFetching: true,
    courses: [makeid(), makeid()],
    lastUpdated: 0,
  };
  handleClick = () => {
    console.log('Clicking Go!');

    // this.props.dispatch(fetchCourses);
  };

  static async getInitialProps() {
    let fakeData = [makeid(), makeid(), makeid()];

    console.log(fakeData);

    return {
      courses: fakeData,
      isFetching: true,
      lastUpdated: Date.now(),
    };
  }

  handleLoadMoreClick = () => {
    console.log('Clicking load more');
  };

  renderCourse(course) {
    return (
      <Course title={course}/>
    );
  }

  render() {
    const {courses} = this.props;

    return (
      <div>
        <button onClick={this.handleClick}>Click Me</button>
        <List loadingLabel={'Loading...'}
              renderItem={this.renderCourse}
              items={courses}
              onLoadMoreClick={this.handleLoadMoreClick}/>
      </div>
    );
  }
}

function makeid() {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

/**
 * @param state
 * @return {{isFetching: boolean}}
 */
const mapStateToProps = (state) => {
  const {isFetching} = state || {
    isFetching: true,
  };

  return {
    isFetching,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchCourse: () => dispatch(fetchCourses('react')),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CoursePage);
