import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addCount, serverRenderClock, startClock } from '../utils/store';
import Page from '../components/Page';

/**
 * @extends Component
 * @constructor
 */
class Counter extends React.Component {

    /**
     * @type {{startClock: shim}}
     */
    static propTypes = {
        startClock: PropTypes.func,
    };

    /**
     * @param store {Store}
     * @param isServer {bool}
     * @return {Promise<{isServer: bool}>}
     */
    static async getInitialProps({store, isServer}) {
        store.dispatch(serverRenderClock(isServer));
        store.dispatch(addCount());

        return {isServer};
    }

    /**
     * Start the timer.
     */
    componentDidMount() {
        this.timer = this.props.startClock();
    }

    /**
     * Reset the timer.
     */
    componentWillUnmount() {
        clearInterval(this.timer);
    }

    /**
     * @return {JSX.Element}
     */
    render() {
        return (
            <Page title='Index Page' linkTo='/other'/>
        );
    }
}

/**
 * @param dispatch
 * @return {{addCount: addCount|ActionCreator<any>|ActionCreatorsMapObject<any>, startClock: startClock|ActionCreator<any>|ActionCreatorsMapObject<any>}}
 */
const mapDispatchToProps = (dispatch) => {
    return {
        addCount: bindActionCreators(addCount, dispatch),
        startClock: bindActionCreators(startClock, dispatch)
    };
};

export default connect(null, mapDispatchToProps)(Counter);
