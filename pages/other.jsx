import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { startClock, addCount, serverRenderClock } from '../utils/store';
import Page from '../components/Page';

class Counter extends React.Component {
    static getInitialProps({store, isServer}) {
        store.dispatch(serverRenderClock(isServer));
        store.dispatch(addCount());
        return {isServer};
    }

    componentDidMount() {
        this.timer = this.props.startClock();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        return (
            <Page title='Other Page' linkTo='/'/>
        );
    }
}

Counter.propTypes = {
    startClock: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
    return {
        addCount: bindActionCreators(addCount, dispatch),
        startClock: bindActionCreators(startClock, dispatch)
    };
};

export default connect(null, mapDispatchToProps)(Counter);
