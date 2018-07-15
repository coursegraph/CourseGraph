import React from 'react';
import PropTypes from 'prop-types';
import { Configure, Highlight, Hits, SearchBox } from 'react-instantsearch/dom';
import { InstantSearch } from './Instantsearch';

/**
 * The display component of the result of a search.
 * @param hit {object} The hit object contains properties of a Course.
 * @param hit.name {String} Department + Number of the Course. E.g. "CMPS 101"
 * @param hit.title {String} Title of the Course.
 *        E.g. "Algorithms and Abstract Data Types"
 * @param hit.terms {String} Term of year offered. E.g. "F" for fall.
 * @param hit.instructor {String} The name of the Instructor. E.g. "Van Gelder"
 * @param hit.geCategories {String} The General Education requirement. E.g. "CC"
 * @param hit.division {String} Indicates "upper-division" "lower-division" or
 *        "graduate".
 * @return {Element}
 * @constructor
 */
const HitComponent = ({hit}) => (
  <div className="hit">
    <div className="hit-content">
      <Highlight attribute="name" hit={hit}/>
      <div/>
      <Highlight attribute="title" hit={hit}/>
      <div/>
      <Highlight attribute="instructor" hit={hit}/>
    </div>
  </div>
);

/**
 * @type {{hit: shim}}
 */
HitComponent.propTypes = {
  hit: PropTypes.object,
};

/**
 * @inheritDoc
 */
class Search extends React.Component {

  /**
   * @type {{searchState: shim, resultsState, onSearchStateChange: shim}}
   */
  static propTypes = {
    searchState: PropTypes.object,
    resultsState: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onSearchStateChange: PropTypes.func,
  };

  /**
   * @return {Element}
   */
  render() {
    return (
      <InstantSearch
        appId="FCQTNAVIWA"
        apiKey="c8a69c0f0dace8e66ba72fa55e730685"
        indexName="courses"
        resultsState={this.props.resultsState}
        onSearchStateChange={this.props.onSearchStateChange}
        searchState={this.props.searchState}
      >
        <Configure hitsPerPage={10}/>
        <header>
          <h1>UCSC Courses</h1>
          <SearchBox/>
        </header>
        <content>
          <results>
            <Hits hitComponent={HitComponent}/>
          </results>
        </content>
      </InstantSearch>
    );
  }
}

export default Search;
