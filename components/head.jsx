import React from 'react';
import NextHead from 'next/head';
import PropTypes from 'prop-types';

const defaultDescription = '';
const defaultOGURL = '';
const defaultOGImage = '';

/**
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Head = (props) => (
  <NextHead>
    <meta charSet="UTF-8"/>
    <title>{props.title || ''}</title>
    <meta name="description" content={props.description || defaultDescription}/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="icon" sizes="192x192" href="/static/touch-icon.png"/>
    <link rel="apple-touch-icon" href="/static/touch-icon.png"/>
    <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882"/>
    <link rel="icon" href="/static/favicon.ico"/>
    <meta property="og:url" content={props.url || defaultOGURL}/>
    <meta property="og:title" content={props.title || ''}/>
    <meta property="og:description" content={props.description || defaultDescription}/>
    <meta name="twitter:site" content={props.url || defaultOGURL}/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:image" content={props.ogImage || defaultOGImage}/>
    <meta property="og:image" content={props.ogImage || defaultOGImage}/>
    <meta property="og:image:width" content="1200"/>
    <meta property="og:image:height" content="630"/>
  </NextHead>
);

/**
 * @type {{title: shim, description: shim, url: shim, ogImage: shim}}
 */
Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  ogImage: PropTypes.string,
};

export default Head;
