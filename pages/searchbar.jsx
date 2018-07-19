import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';

import { withStyles } from '@material-ui/core/styles';
import PopMenu from '../components/PopMenu';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

let indices = [];

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: this.props.courses.slice(0, 15),
    };
  }

  static propTypes = {
    courses: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
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

  filter = (event) => {
    console.log(`running page version of filter`);
    let stringArray = new Array(this.props.courses.length);
    for (let i = 0; i < this.props.courses.length; i++) {
      stringArray[i] =
        //JSON.stringify(this.state.unfiltered[i].name.toUpperCase()) +
        //JSON.stringify(this.state.unfiltered[i].title.toUpperCase()) +
        JSON.stringify(this.props.courses[i].instructor.toUpperCase());
    }
    let indexz = [];
    let newArray = [];
    for (let i = 0; i < this.props.courses.length; i++) {
      if (stringArray[i].indexOf(event.target.value.toUpperCase() ) > -1 )  {
        indexz.push(i);
      }
    }
    for (let i = 0; i < indexz.length; i++) {
      newArray.push(this.props.courses[indexz[i]]);
    }
    indices = indexz.slice();
    this.setState({
      filtered: newArray,
      visibleElements: 15,
    });
  };


  render() {
    console.log(`indices: ${indices}`);
    return (
      <div>
        <PopMenu array={this.state.filtered} filter={event => this.filter(event)}/>
      </div>
    );
  }
}

export default withStyles(styles)(Index);
