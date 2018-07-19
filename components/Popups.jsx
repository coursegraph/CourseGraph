import React from 'react';
import Popup from 'reactjs-popup';


class Popups extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      tags: [] || props.tags,
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

  handleClick(e) {
    if (e === 'N/A') {
      this.state.tags = 'N/A';
    }
    if (e === 'In Progress') {
      this.state.tags = 'In Progress';
    }
    if (e === 'Finished') {
      this.state.tags = 'Finished';
    }
    console.log(`get tags: ${this.state.tags}`);
  }

  render() {
    return <div>
      <Popup trigger={<a className="button">{this.props.myLists.course_title}</a>} modal>
        {close => (
          <div className="modal">
            <a className="close" onClick={close}>&times;</a>
            <button onClick={() => this.handleClick('N/A')}>N/A</button>
            <button onClick={() => this.handleClick('In Progress')}>In Progress</button>
            <button onClick={() => this.handleClick('Finished')}>Finished</button>
            <div className="header">{this.props.myLists.course_number}</div>
            <div className={'content'}>
              <p>{'Instructor: '}{this.props.myLists.instructor}</p>
              <p>{'Time: '}{this.props.myLists.time}</p>
              <p>{'Location: '}{this.props.myLists.location}</p>
            </div>
          </div>
        )}
      </Popup>
    </div>;
  }
}

export default Popups;