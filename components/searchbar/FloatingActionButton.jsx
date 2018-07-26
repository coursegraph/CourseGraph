import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Draggable from 'react-draggable';

/**
 * Material UI theme styles. This Button can float above other components.
 * @param theme
 * @return {{
 * extendedIcon: {marginRight: number},
 * absolute: {position: string, top: number, left: number}
 * }}
 */
const styles = theme => ({
  extendedIcon: {
    'marginRight': theme.spacing.unit,
  },
  absolute: {
    'position': 'absolute',
    'top': theme.spacing.unit * 4,
    'left': theme.spacing.unit * 6,
  },
});

/**
 * @param props
 * @return {Element}
 * @constructor
 */
class FloatingActionButtons extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    buttonClick: PropTypes.func.isRequired,
  };

  render() {
    const {classes} = this.props;

    return (
      <Draggable>
        <Button variant="extendedFab"
                aria-label="Delete"
                className={classes.absolute}
                onClick={this.props.buttonClick}
        >
          <SearchIcon className={classes.extendedIcon}/>
          Open Search Bar
        </Button>
      </Draggable>
    );
  }
}

export default withStyles(styles)(FloatingActionButtons);
