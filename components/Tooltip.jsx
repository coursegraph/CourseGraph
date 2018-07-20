import React from 'react';
import PropTypes from 'prop-types';

class Tooltip extends React.Component {
  static PropTypes = {
    content: PropTypes.string,
    name: PropTypes.object,
  }

  static defaultProps = {
    content: '',
    name: [],
  };

  constructor(props) {
    super(props);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.state = {
      visible: false,
    };
  }

  handleMouseOver = () => {
    this.setState({visible: true});
  };

  handleMouseOut = () => {
    this.setState({visible: false});
  };

  handleFocus = () => {
    this.setState({visible: false});
  };

  render() {
    return <div>
      <div
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onFocus={this.handleFocus}
      >
        {this.props.name}
      </div>
      {this.state.visible && this.props.content}
    </div>;
  }
}

export default Tooltip;