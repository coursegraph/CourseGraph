import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import Header from '../../components/Header';

/**
 * Search Page
 */
export default class extends React.Component {
  static propTypes = {
    // resultsState: PropTypes.object,
    // searchState: PropTypes.object,
  };

  // static async getInitialProps(params) {
  //   return {resultsState, searchState};
  // }

  render() {
    return (
      <div>
        <Header/>
        <h1> UCSD </h1>
        <div>
          Home page
        </div>
      </div>
    );
  }
}
