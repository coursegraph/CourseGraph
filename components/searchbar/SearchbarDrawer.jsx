import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';

import SearchbarAssembly from '../searchbar/SearchbarAssembly';
import SelectedList from '../searchbar/SelectedList';

/**
 * Component that you can trigger a button to open the drawer.
 */
class SearchbarDrawer extends Component {
  static propTypes = {
    classes: PropTypes.object,
    courses: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    itemClick: PropTypes.func.isRequired,
    selClick: PropTypes.func.isRequired,
  };

  state = {
    isOpen: false,
  };

  toggleDrawer = (open) => () => {
    this.setState({
      isOpen: open,
    });
  };

  render() {
    const {courses, selected, selClick, itemClick} = this.props;

    return (
      <div>
        <Button onClick={this.toggleDrawer(true)}>
          Open Search Bar
        </Button>
        <Drawer anchor="left"
                open={this.state.isOpen}
                onClose={this.toggleDrawer(false)}
        >
          <SearchbarAssembly courses={courses}
                             itemClick={(event, id) => itemClick(event, id)}/>
          <SelectedList courses={courses}
                        selected={selected}
                        selClick={(event, sel) => selClick(event, sel)}/>
        </Drawer>
      </div>
    );
  }
}

export default SearchbarDrawer;
