import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';

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
    const res = await fetch('https://coursegraph.org/api/courses');
    const data = await res.json();

    console.log(`Show data fetched. Count: ${data.length}`);

    return {
      courses: data,
    };
  }

  render() {
    return (
      <div>
        <h1>UCSC Courses</h1>
        <List>
          {
            this.props.courses.map(({course_title}) => (
              <ListItem button component="a" href="https://www.ucsc.edu/">
                <ListItemText key={course_title}
                              primary={course_title}/>
              </ListItem>
            ))
          }
        </List>
        <Divider/>
      </div>
    );
  }
}

export default withStyles(styles)(Index);
