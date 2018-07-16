import React from 'react';
import Popup from 'reactjs-popup';
//import PopMenu from 'PopMenu';

class Popups extends React.Component {

  static defaultProps = {
    myLists: ({
      course_title: 'Software Engineering',
      course_number: '123',
      instructor: 'Richard',
      time: 'MW 9:00-12:30AM',
      location: 'LEC Annix 101',
    }),
  };


  render() {
    return <div>
      <Popup trigger={<a className="button">{this.props.myLists.course_title}</a>} modal>
        {close => (
          <div className="modal">
            <a className="close" onClick={close}>&times;</a>
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