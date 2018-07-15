import React from 'react';
import PropTypes from 'prop-types';
import { Configure, Hits, SearchBox, } from 'react-instantsearch/dom';
import { InstantSearch } from './Instantsearch';

const HitComponent = ({hit}) =>
  <div className="hit">
    <div className="hit-content">
      {hit.name}
    </div>
  </div>;

HitComponent.propTypes = {
  hit: PropTypes.object,
};

export default class extends React.Component {
  static propTypes = {
    searchState: PropTypes.object,
    resultsState: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onSearchStateChange: PropTypes.func,
  };

  render() {
    return (
      <InstantSearch
        appId="FCQTNAVIWA"
        apiKey="c8a69c0f0dace8e66ba72fa55e730685"
        indexName="getstarted_actors"
        resultsState={this.props.resultsState}
        onSearchStateChange={this.props.onSearchStateChange}
        searchState={this.props.searchState}
      >
        <Configure hitsPerPage={10}/>
        <header>
          <h1>React InstantSearch + Next.Js</h1>
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
