import React from 'react';
import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';

import { initStore } from '../utils/store';

export default withRedux(initStore)(class MyApp extends App {

  /**
   * @param Component
   * @param ctx
   * @return {Promise<{pageProps: {}}>}
   */
  static async getInitialProps({Component, ctx}) {
    return {
      pageProps: (Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
    };
  }

  /**
   * @return {JSX.Element}
   */
  render() {
    const {Component, pageProps, store} = this.props;
    return <Container>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </Container>;
  }
});
