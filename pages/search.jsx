import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import qs from 'qs';

import App from '../components/Search';
import { findResultsState } from '../components/Instantsearch';

/**
 * @type {number}
 */
const updateAfter = 700;

/**
 * @param searchState
 * @return {string} the url
 */
const searchStateToUrl = searchState =>
  searchState ? `${window.location.pathname}?${qs.stringify(searchState)}` : '';

/**
 * Search Page
 */
export default class extends React.Component {
  static propTypes = {
    resultsState: PropTypes.object,
    searchState: PropTypes.object,
  };
  
  onSearchStateChange = searchState => {
    clearTimeout(this.debouncedSetState);
    this.debouncedSetState = setTimeout(() => {
      const href = searchStateToUrl(searchState);
      Router.push(href, href, {
        shallow: true,
      });
    }, updateAfter);
    this.setState({searchState});
  };

  constructor() {
    super();
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
  }

  static async getInitialProps(params) {
    const searchState = qs.parse(
      params.asPath.substring(params.asPath.indexOf('?') + 1)
    );
    const resultsState = await findResultsState(App, {searchState});


    let hits = resultsState.content.hits;

    hits.forEach((hit) => {
      console.log(hit);
    });

    return {resultsState, searchState};
  }

  componentDidMount() {
    this.setState({searchState: qs.parse(window.location.search.slice(1))});
  }

  componentWillReceiveProps() {
    this.setState({searchState: qs.parse(window.location.search.slice(1))});
  }

  render() {
    return (
      <div>
        <h1> Search </h1>
        <div>
          <App
            resultsState={this.props.resultsState}
            onSearchStateChange={this.onSearchStateChange}
            searchState={
              this.state && this.state.searchState
                ? this.state.searchState
                : this.props.searchState
            }
          />
        </div>
      </div>
    );
  }
}
