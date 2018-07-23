import React from 'react';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

const selectStyle = {
  maxWidth: '300px',
  overflow: 'auto',
  maxHeight: '300px',
};

const selectText = {
  fontSize: 10,
};

export default class SelectedList extends React.Component {
  render() {
    return (
      <div id="selectDiv" style={selectStyle} onScroll={this.onListScroll}>
        <Paper>{this.props.selected.map((course) => (
          <Chip
            key={course}
            style={selectText}
            label={this.props.courses[course].label}
            onDelete={this.props.selClick.bind(this, course)}
          />
        ))}</Paper>
      </div>
    );
  }
}