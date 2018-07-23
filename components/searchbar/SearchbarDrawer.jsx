import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import SearchbarAssembly from '../searchbar/SearchbarAssembly';
import SelectedList from '../searchbar/SelectedList';

export default class SearchbarDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggleDrawer = (open) => () => {
    this.setState({
      isOpen: open,
    });
  };

  render() {
    const contents = this.props.courses;

    return (
      <div>
        <Button onClick={this.toggleDrawer(true)}>Open Search Bar</Button>
        <Drawer anchor="left" open={this.state.isOpen}
                onClose={this.toggleDrawer(false)}>
          <SearchbarAssembly courses={contents}
                             itemClick={(event, id) => this.props.itemClick(event, id)}/>
          <SelectedList courses={contents} selected={this.props.selected}
                        selClick={(event, sel) => this.props.selClick(event, sel)}/>
        </Drawer>
      </div>
    );
  }
}
