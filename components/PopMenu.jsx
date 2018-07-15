import React from 'react';
import Popup from 'reactjs-popup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
//import '../styles/PopMenu.css';

const lStyle = {
  margin: '30px',
  border: '5px solid pink',
  maxWidth: '30px',
  paddingBottom: '30px',
  height: '30px',
};

const pStyle = {
  fontSize: '14px',
  textAlign: 'left',
};

const inStyle = {
  width: '300px',
  fontSize: '14px',
}

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
      filtered: props.unfilteredArray.slice(0, 10),
    };

  }

  //changedArray = ['weheee!!', 'gibbergooble!', 'whaKAAKAKAKAKA!'];


  filter = (event) => {
    //alert('BOOP!');
    console.log(`typed in: ${event.target.value}`);
    let newArray = this.state.unfiltered.filter(match(event.target.value));
    let shrunkArray = newArray.slice(0, 10);
    let result = shrunkArray.join(', ');
    console.log(`got result: ${result}`);
    result = newArray.join(', ');
    console.log(`full results: ${result} `);
    // let newArray = [];
    // for (let i = 0; i < this.state.unfiltered.length; i++) {
    //   if (this.state.unfiltered[i].toUpperCase().indexOf(event.target.value) > -1) {
    //     console.log(`return: ${this.state.unfiltered[i].toUpperCase().indexOf(event.target.value)}`);
    //     newArray.push(this.state.unfiltered[i]);
    //     console.log(`newArray: ${newArray} i is ${i}`);
    //   }
    // }
    this.setState({filtered: shrunkArray});
    console.log(`filter filtered: ${this.state.filtered}`);
  }


  render() {
    console.log(`in Render, filtered: ${this.state.filtered}`);

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
          <List>{this.state.filtered.map(value => (
            <ListItem
              style={pStyle}
              key={value}
              dense
              divider
              button
            >
              <ListItemText primary={value}/>
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

