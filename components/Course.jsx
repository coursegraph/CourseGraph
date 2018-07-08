import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param course {object}
 * @return {Element}
 * @constructor
 */
const Course = ({course}) => {
  return (
    <div className="Course">
      <h3>
        CMPS 115
      </h3>
      <p>
        temp test text
      </p>
    </div>
  );
};

Course.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Course;
