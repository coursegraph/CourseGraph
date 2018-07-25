import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

/**
 * Define the style of components on this page
 * @param theme
 * @return {object}
 */
const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '90%',
  },
});

/**
 * Simple Input interface that prompts input from user.
 */
class SearchBar extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    value: '',
  };

  onChange = (event) => {
    this.setState({value: event.target.value});
    this.props.onChange(event.target.value);
  };

  render() {
    const {classes} = this.props;

    return (<TextField className={classes.textField}
                       label="Classes Search"
                       type="search"
                       value={this.value}
                       onChange={this.onChange}
                       placeholder="Search for Classes"/>
    );
  }
}

export default withStyles(styles)(SearchBar);
