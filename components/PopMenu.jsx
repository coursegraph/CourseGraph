import React from 'react';
import Popup from 'reactjs-popup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Draggable from 'react-draggable';

/**
 * Required Props:
 *  array: array of JSON objects, should have string children of: name, title, instructor etc
 *  filter: filtering function of your choice, should act on above mentioned array
 */


//style declaration
const lStyle = {
  overflow: 'auto',
  maxHeight: '400px',
  width: '300px',
};

const pStyle = {
  fontSize: '14px',
  textAlign: 'left',

};

const inStyle = {
  width: '300px',
  fontSize: '14px',
};

class CourseDetailsWindow extends React.Component {
  render() {
    const course = this.props.course;
    return (
      <div className="modal">
        <a className="close" onClick={this.props.onClose}>&times;</a>
        <div className="header">
          {`${course.name} ${course.title}`}
        </div>
        <div className={'content'}>
          <p>{`Instructor: ${course.instructor}`}</p>
          <p>{`Terms: ${course.terms}`}</p>
          <p>{`GE: ${course.geCategories}`}</p>
          <p>{`Division: ${course.division}`}</p>
          <p>{`Description: ${course.description}`}</p>
        </div>
      </div>
    );
  }
}

class PopMenu extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    this.state = {
      visibleElements: 15,
      popupVisible: false,
    };

  }

  onListScroll = (event) => {
    const el = document.getElementById('listDiv');
    const max = el.scrollHeight;
    const scrolled = el.scrollTop;
    let newVisibleElements = this.state.visibleElements + 15;

    if ((max - scrolled) < 410) {
      this.setState({
        visibleElements: newVisibleElements,
      });
    }

    //console.log(`max scroll height % : ${max}`);
    //console.log(`amount scrolled? : ${scrolled}`);
  };

  handleFilterCall = (event) => {
    this.props.filter(event);
    this.setState({visibleElements: 15});
  };

  handleClick() {
    if (!this.state.popupVisible) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      popupVisible: !prevState.popupVisible,
    }));
  }

  handleOutsideClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }
    this.handleClick();
  }

  render() {
    const data = this.props.array.slice(0, this.state.visibleElements);
    let n = 0;
    //console.log(`in Render, filtered: ${this.state.filtered}`);

    return (
      <Draggable enableUserSelectHack={false}>
        <div>
          <Popup
            trigger={<input style={inStyle} onChange={this.handleFilterCall}
                            type="text" placeholder="YAY!"/>}
            position="bottom left"
            onOpen={this.handleClick}
            //on="click"
            //closeOnDocumentClick
            mouseLeaveDelay={300}
            mouseEnterDelay={0}
            contentStyle={{padding: '0px', border: 'none'}}
            arrow={false}
          >
            {this.state.popupVisible && (
              <div ref={node => {
                this.node = node;
              }} style={lStyle} id="listDiv" onScroll={this.onListScroll}>
                <List>{data.map((course) => (
                  <div ref={this.setWrapperRef}>
                    <Popup trigger={
                      <ListItem
                        style={pStyle}
                        key={course.name + `${n++}`}
                        dense
                        divider
                        button
                      >
                        <ListItemText primary={name + ' ' + this.props.title}
                                      secondary={`Instr: ${this.props.instructor}`}/>
                      </ListItem>
                    } modal>
                      {close =>
                        <CourseDetailsWindow course={course} onClose={close} />
                      }
                    </Popup>
                  </div>
                ))}
                </List>
              </div>
            )}
          </Popup>
        </div>
      </Draggable>
    );
  }
}

export default PopMenu;
