import React from 'react';
import Popup from 'reactjs-popup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const lStyle = {
  overflow: 'auto',
  maxHeight: '400px',
};

const pStyle = {
  fontSize: '14px',
  textAlign: 'left',
};

const inStyle = {
  width: '300px',
  fontSize: '14px',
};

function match(query) {
  let q = query.toUpperCase();
  return function(value) {
    return value.toUpperCase().indexOf(q) > -1;
  };
}



class PopMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      unfiltered: props.unfilteredArray.slice(),
      //filtered: props.unfilteredArray.slice(),
      filtered: props.unfilteredArray.slice(0, 10),
    };

  }


  filter = (event) => {
    let stringArray = new Array(this.state.unfiltered.length);
    for (let i = 0; i < this.state.unfiltered.length; i++) {
      stringArray[i] = JSON.stringify(this.state.unfiltered[i].course_title.toUpperCase());
    }
    //console.log(`get stringArray: ${stringArray}`);
    let indices = [];
    let newArray = [];
    for (let i = 0; i < this.state.unfiltered.length; i++) {
      if (stringArray[i].indexOf(event.target.value.toUpperCase() ) > -1 )  {
        indices.push(i);
      }
    }
    for (let i = 0; i < indices.length; i++){
      newArray.push(this.state.unfiltered[indices[i]]);
    }
    //let shrunkArray = newArray.slice(0, 10);
    //let result = shrunkArray.join(', ');
    //console.log(`got result: ${result}`);
    let result = newArray.join(', ');
    console.log(`got result: ${result}`);

    this.setState({filtered: newArray});
    //console.log(`filter filtered: ${this.state.filtered}`);
  }


  render() {
    const data = this.state.filtered.slice(0, 15);
    let n = 0;
    //console.log(`in Render, filtered: ${this.state.filtered}`);

    return (
      <div>
        <Popup
          trigger={<div>
            <input style={inStyle} onChange={this.filter} type="text" placeholder="YAY!"/>
          </div>}
          position="bottom left"
          on="click"
          closeOnDocumentClick
          mouseLeaveDelay={300}
          mouseEnterDelay={0}
          contentStyle={{padding: '0px', border: 'none'}}
          arrow={false}
        >
          <List style={lStyle}>{data.map(({course_title}) => (
            <ListItem
              style={pStyle}
              key={course_title + `${n++}`}
              dense
              divider
              button
            >
              <ListItemText primary={course_title}/>
            </ListItem>
          )
          )
          }</List>
        </Popup>
      </div>
    );
  }
}


export default PopMenu;
