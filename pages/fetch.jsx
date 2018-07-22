import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';

import { withStyles } from '@material-ui/core/styles';

import Header from '../components/Header';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class Index extends React.Component {
  static propTypes = {
    courses: PropTypes.arrayOf(PropTypes.shape({
      course_title: PropTypes.string.isRequired,
    })),
  };

  static async getInitialProps() {
    const res = await fetch('https://coursegraph.org/api/courses/ucsd');
    const data = await res.json();

    console.log(`Show data fetched. Count: ${data.length}`);

    return {
      courses: data,
    };
  }

  render() {
    return (
      <div>
        <Header/>
        <h1>UCSC Courses</h1>

      </div>
    );
  }
}

export default withStyles(styles)(Index);
