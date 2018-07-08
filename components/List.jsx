import React from 'react';
import PropTypes from 'prop-types';

/**
 * @extends {Component}
 * @constructor
 */
export default class List extends React.Component {
  static propTypes = {
    loadingLabel: PropTypes.string.isRequired,
    renderItem: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    onLoadMoreClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isFetching: true,
    loadingLabel: 'Loading...',
  };

  /**
   * @return {Element}
   */
  renderLoadMore() {
    const {isFetching, onLoadMoreClick} = this.props;
    return (
      <button style={{fontSize: '150%'}}
              onClick={onLoadMoreClick}
              disabled={isFetching}>
        {isFetching ? 'Loading...' : 'Load More'}
      </button>
    );
  }

  /**
   * @return {Element}
   */
  render() {
    const {
      isFetching, items, renderItem,
      loadingLabel,
    } = this.props;

    const isEmpty = items.length === 0;
    if (isEmpty && isFetching) {
      return <h2><i>{loadingLabel}</i></h2>;
    }

    return (
      <div>
        {items.map(renderItem)}
        {this.renderLoadMore()}
      </div>
    );
  }
}
