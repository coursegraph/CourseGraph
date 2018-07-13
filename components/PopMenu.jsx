import React from 'react';
import Popup from 'reactjs-popup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


class PopMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      unfiltered: props.unfilteredArray.slice(),
      filtered: props.unfilteredArray.slice(),
    };
    console.log(`Props are: ${this.props}`);
    console.log(`unfilteredArray? : ${props.unfilteredArray}`);
    console.log(`filtered : ${this.state.filtered}`);

    const hateThis = this.state.filtered.slice(0);
    console.log(`HateThis: ${hateThis}`);
  }

  changedArray = ['weheee!!', 'gibbergooble!', 'whaKAAKAKAKAKA!'];



  filter = () => {
    //alert('BOOP!');
    this.setState({filtered: this.changedArray });
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
        <div>safety!</div>
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