import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * @extends Component
 * @constructor
 */
export default class Post extends Component {

    /**
     * @type {{postId: shim}}
     */
    static propTypes = {
        postId: PropTypes.number,
    };

    /**
     * @param id {number}
     * @return {Promise<{postId: number}>}
     */
    static async getInitialProps({query: {id}}) {
        return {postId: id};
    }

    /**
     * @return {JSX.Element}
     */
    render() {
        return <div>
            <h1>My blog post #{this.props.postId}</h1>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua.
            </p>
        </div>;
    }
}
