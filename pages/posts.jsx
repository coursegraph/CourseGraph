import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Post extends Component {
    static async getInitialProps({query: {id}}) {
        return {postId: id};
    }

    static propTypes = {
        postId: PropTypes.number,
    };

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
