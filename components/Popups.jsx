import React from 'react';
import Popup from 'reactjs-popup';

class Popups extends React.Component {

  static defaultProps = {
    list: ({
      course_id: 'CMPS115',
      course_title: 'CMPS115 - Software Engineering',
      course_description: 'asffodfi',
      course_instructor: 'Richard',
    }),
  }

  render() {
    return (
      <div>
        <Popup trigger={<a className="button">{this.props.list.course_id}</a>} modal>
          {close => (
            <div className="modal">
              <a className="close" onClick={close}>&times;</a>

              <div className="header">{this.props.list.course_title}</div>
              <div className="content">
                <p>{'Course Description: '}{this.props.list.course_description}</p>
                <p>{'Instructor: '}{this.props.list.course_instructor}</p>
              </div>
            </div>
          )}
        </Popup>
      </div>
    );
  }
}

export default Popups;