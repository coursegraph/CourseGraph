/* eslint-disable react/display-name */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

export default class Items extends Component {
    static async getInitialProps({req, query}) {
        const isServer = !!req;

        console.log('getInitialProps called:', isServer ? 'server' : 'client');
        console.log(query);

        if (isServer) {
            // When being rendered server-side, we have access to our data in query that we put there in routes/item.js,
            // saving us an http call. Note that if we were to try to require('../operations/get-item') here,
            // it would result in a webpack error.
            return {item: query.itemData};
        } else {
            // On the client, we should fetch the data remotely
            const res = await fetch('/_data/item', {headers: {'Accept': 'application/json'}});
            const json = await res.json();
            return {item: json};
        }
    }

    render() {
        return (
            <div className='item'>
                <div><Link href='/'><a>Back Home</a></Link></div>
                <h1>{this.props.item.course_title}</h1>
            </div>
        );
    }
}

Items.propTypes = {
    item: PropTypes.shape({
        course_title: PropTypes.string,
    }),
};
