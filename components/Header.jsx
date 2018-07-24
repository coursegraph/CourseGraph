import React from 'react';
import NextHead from 'next/head';
import NProgress from 'nprogress';
import Router from 'next/router';

Router.onRouteChangeStart = (url) => {
  console.log(`Loading: ${url}`);
  NProgress.start();
};

Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

/**
 * A header Component that provide Progress bar
 * @return {*}
 */
export default () => (
  <div style={{marginBottom: 20}}>
    <NextHead>
      <meta charSet="UTF-8"/>
      <title>Course Graph</title>
      <meta
        name="description"
        content="A lightning-fast search for your UCSC courses"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <link rel="icon" sizes="192x192" href="/static/touch-icon.png"/>
      <link rel="apple-touch-icon" href="/static/touch-icon.png"/>
      <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882"/>
      <link rel="icon" href="/static/favicon.ico"/>
      <link rel="stylesheet" type="text/css" href="/static/nprogress.css"/>
    </NextHead>
  </div>
);
