/* eslint-disable react/display-name */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

/**
 * @extends Component
 * @constructor
 */
export default class Items extends Component {

  /**
   * @type {{items: shim, item}}
   */
  static propTypes = {
    item: PropTypes.shape({
      course_title: PropTypes.string,
    }),
  };

  /**
   * @param req
   * @param query {{itemData}}
   * @return {Promise<{item:json}>}
   */
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
      const res = await fetch('/api/item', {headers: {'Accept': 'application/json'}});
      const json = await res.json();
      console.log(json);
      return {item: json};
    }
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    return (
      <div className="item">
        <div><Link href="/"><a>Back Home</a></Link></div>
        <h1>
          <ol>{
            this.props.item.map((obj) => (
              <li>{obj.course_title}</li>
            ))
          }</ol>
        </h1>
      </div>
    );
  }
}

