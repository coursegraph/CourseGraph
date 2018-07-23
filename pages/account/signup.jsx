import React, { Component } from 'react';

export default class Login extends Component {

  handleSubmit = event => {
    event.preventDefault();
  };

  render() {
    return (
      <div className="signup">
        <h1>Signup</h1>
        <form onSubmit={this.handleSubmit}>

        </form>
      </div>
    );
  }
}
