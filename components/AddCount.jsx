import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addCount } from '../utils/store';

/**
 * @extends Component
 * @constructor
 */
class AddCount extends Component {
    /**
     * @type {{count: shim, addCount: shim}}
     */
    static propTypes = {
      count: PropTypes.number,
      addCount: PropTypes.func,
    };

  constructor(...args) {
    super(...args);

    this.add = () => {
      this.props.addCount();
    };
  }

    /**
     * @return {JSX.Element}
     */
    render() {
      const {count} = this.props;
      return (
        <div>
          <style jsx>{`
          div {
            padding: 0 0 20px 0;
          }
      `}</style>
          <h1>AddCount: <span>{count}</span></h1>
          <button onClick={this.add}>Add To Count</button>
        </div>
      );
    }
}

const mapStateToProps = ({count}) => ({count});

const mapDispatchToProps = (dispatch) => {
  return {
    addCount: bindActionCreators(addCount, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCount);
