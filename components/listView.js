import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class listView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listdata: this.props.listdata, //error occurs here where because listdata is undefined?
    };
  }

  render() {
    return (
      <List>{this.state.listdata.map(value => (  //here's where the code actually breaks. "cannot read property map of undefined
        <ListItem
          key={value}
          role={undefined}
          dense
          divider
          button
          onClick={() => alert('replace with class popup component plz')}
        >
          <ListItemText primary={value} secondary={'if we want subtext'}/>
        </ListItem>
      )
      )
      }</List>
    );
  }
}

export default listView;