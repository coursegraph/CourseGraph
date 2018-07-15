import React from 'react';
import PopMenu from '../components/PopMenu';
import fetch from 'isomorphic-unfetch';
import PropTypes from 'prop-types';

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
    console.log(`in render: ${this.props.courses}`);
    return (
      <div>
        <h1>UCSC Courses</h1>
      </div>
    );
  }
}

const testingArray = ['applebick', 'chimichanga', 'sicklewickle', 'pickleWart', 'gipple', 'sfdsfisdaf', 'dfgtir', 'sigrerty', 'erieyty', 'poijl', 'eieieo', 'IIIIII', 'IIEEEEE', 'Ihatelyfe']

export default () => (
  <div>
    <Index/>
    <PopMenu className="PopMenu" unfilteredArray={testingArray}/>
  </div>
);