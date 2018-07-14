import React from 'react';
import Popup from 'reactjs-popup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

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
      filtered: props.unfilteredArray.slice(),
    };

  }

  //changedArray = ['weheee!!', 'gibbergooble!', 'whaKAAKAKAKAKA!'];





  filter = (event) => {
    //alert('BOOP!');
    console.log(`typed in: ${event.target.value}`);
    let newArray = this.state.unfiltered.filter(match(event.target.value));
    let result = newArray.join(', ');
    console.log(`got result: ${result}`);
    // let newArray = [];
    // for (let i = 0; i < this.state.unfiltered.length; i++) {
    //   if (this.state.unfiltered[i].toUpperCase().indexOf(event.target.value) > -1) {
    //     console.log(`return: ${this.state.unfiltered[i].toUpperCase().indexOf(event.target.value)}`);
    //     newArray.push(this.state.unfiltered[i]);
    //     console.log(`newArray: ${newArray} i is ${i}`);
    //   }
    // }
    this.setState({filtered: newArray });
    console.log(`filter filtered: ${this.state.filtered}`);
  }



  render() {
    console.log(`in Render, filtered: ${this.state.filtered}`);

    return <div>
      <Popup
        trigger={<div className="menu-item">
          <input onChange={this.filter} type="text" placeholder="YAY!"/>
        </div>}
        position="right top"
        on="click"
        closeOnDocumentClick
        mouseLeaveDelay={300}
        mouseEnterDelay={0}
        contentStyle={{padding: '0px', border: 'none'}}
        arrow={false}
      >
        <List>{this.state.filtered.map(value => (
          <ListItem
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
    </div>;
  }
}

export default PopMenu;