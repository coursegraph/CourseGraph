import React from 'react';
import PropTypes from 'prop-types';

// The modal "window"
const modalStyle = {
  backgroundColor: '#fff',
  borderRadius: 5,
  maxWidth: 500,
  minHeight: 300,
  margin: '0 auto',
  padding: 30,
};

class Tooltip extends React.Component {
  static propTypes = {
    content: PropTypes.object,
    trigger: PropTypes.object,
  };

  static defaultProps = {
    content: '',
    trigger: '',
  };

  constructor(props) {
    super(props);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  handleMouseOver = () => {
    this.setState({isOpen: true});
  };

  handleMouseOut = () => {
    this.setState({isOpen: false});
  };

  handleClick = () => {
    if (!this.state.isOpen) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }
    this.setState({
      isOpen: this.state.isOpen,
    });
  };

  handleOutsideClick = (e) => {
    if (this.node.contains(e.target)) {
      return;
    }
    this.handleClick();
  };


  render() {
    return (
      <div>
        <div
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onClick={this.handleClick}
          onClose={this.handleOutsideClick}
        >
          {this.props.trigger}
        </div>
        <div>
          {this.state.isOpen &&
            <div style={modalStyle}>
              {this.props.content}
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Tooltip;