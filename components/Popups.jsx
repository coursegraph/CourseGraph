import React from 'react';
import Popup from 'reactjs-popup';

class CourseDetailsPanel extends React.Component {
  render() {
    const course = this.props.course;
    return (
      <div className={'content'}>
        <p>{'Instructor: '}{course.instructor}</p>
        <p>{'Time: '}{course.time}</p>
        <p>{'Location: '}{course.location}</p>
      </div>
    );
  }
}

class CourseDetailsWindow extends React.Component {
  render() {
    const course = this.props.course;
    return (
      <div className="modal">
        <a className="close" onClick={this.props.onClose}>&times;</a>
        <button onClick={this.props.onSelectDefTag('N/A')}>N/A</button>
        <button onClick={this.props.onSelectDefTag('In Progress')}>In Progress</button>
        <button onClick={this.props.onSelectDefTag('Finished')}>Finished</button>
        <div className="header">{course.course_number}</div>
        <CourseDetailsPanel course={course} />
      </div>
    );
  }
}

class Popups extends React.Component {
  constructor(props) {
    super(props);
    this.removeDefTags = this.removeDefTags.bind(this);
    this.selectDefTag = this.selectDefTag.bind(this);
    this.state = {
      deftags: [] || props.tags,
    };
  }

  static defaultProps = {
    myLists: ({
      course_title: 'Software Engineering',
      course_number: '123',
      instructor: 'Richard',
      time: 'MW 9:00-12:30AM',
      location: 'LEC Annex 101',
    }),
  };

  removeDefTags() {
    if(this.state.deftags === 'N/A'
      || this.state.deftags === 'In Progress'
      || this.state.deftags === 'Finished') {
      this.state.deftags = '';
    }
  }

  selectDefTag(e) {
    this.removeDefTags();
    if (e === 'N/A') {
      this.state.deftags = 'N/A';
    }
    if (e === 'In Progress') {
      this.state.deftags = 'In Progress';
    }
    if (e === 'Finished') {
      this.state.deftags = 'Finished';
    }
  }

  render() {
    return <div>
      <Popup
        trigger={<a className="button">{this.props.myLists.course_title}</a>} modal>
        {close =>
          <CourseDetailsWindow
            course={this.props.myLists}
            onClose={close}
            onSelectDefTag={(tag) => this.selectDefTag(tag)} />
        }
      </Popup>
    </div>;
  }
}

export default Popups;