import React from 'react';
import PropTypes from 'prop-types';

class CourseDetailsPanel extends React.Component {
  render() {
    const course = this.props.course;
    return (
      <div className={'content'}>
        <p>{`Instructor: ${course.instructor}`}</p>
        <p>{`Terms: ${course.terms}`}</p>
        <p>{`GE: ${course.geCategories}`}</p>
        <p>{`Division: ${course.division}`}</p>
        <p>{`Description: ${course.description}`}</p>
      </div>
    );
  }
}

class CourseDetailsWindow extends React.Component {
  render() {
    const course = this.props.course;
    return (
      <div className="modal">
        <button onClick={this.props.onSelectDefTag('N/A')}>N/A</button>
        <button onClick={this.props.onSelectDefTag('In Progress')}>In Progress</button>
        <button onClick={this.props.onSelectDefTag('Finished')}>Finished</button>
        <div className="header">{course.course_number}</div>
        <CourseDetailsPanel course={course} />
      </div>
    );
  }
}

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

  handleClick() {
    if (!this.state.isOpen) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  }

  handleOutsideClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }
    this.handleClick();
  }

  render() {
    return (
      <div>
        <div
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onClick={this.handleClick}
        >
          {this.props.trigger}
        </div>
        {this.state.isOpen && this.props.content}
      </div>
    );
  }
}

export default Tooltip;