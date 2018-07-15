import React from 'react';
import PropTypes from 'prop-types';

/**
 * @inheritDoc
 */
class Course extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    title: 'Null',
  };

  /**
   * @return {Element}
   */
  render() {
    return (
      <div className="Course">
        <h3>
          {this.props.title}
        </h3>
      </div>
    );
  }
}

export default Course;
