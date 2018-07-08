import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Course from '../components/Course';
import List from '../components/List';

/**
 * @constructor
 * @extends {Component}
 */
class CoursePage extends React.Component {
  static propTypes = {
    courses: PropTypes.array.isRequired,
  };

  handleLoadMoreClick = () => {
    console.log('Clicking load more');
  };

  renderCourse(course) {
    return (
      <Course title={'something'}/>
    );
  }

  render() {
    const {courses} = this.props;

    return (
      <div>
        <List loadingLabel={'Loading...'}
              renderItem={this.renderCourse}
              items={courses}
              onLoadMoreClick={this.handleLoadMoreClick}/>
      </div>
    );
  }
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

export default connect(mapStateToProps)(CoursePage);
