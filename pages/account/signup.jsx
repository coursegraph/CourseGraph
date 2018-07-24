import React, { Component } from 'react';

import Header from '../../components/Header';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import fetch from 'isomorphic-unfetch';

export default class Login extends Component {
  state = {
    email: 'email',
    password: '',
    confirmPassword: '',
  };

  handleChange = (email, password, confirmPassword) => (event) => {
    this.setState({
      [email]: event.target.value,
      [password]: event.target.value,
      [confirmPassword]: event.target.value,
    });
  };

  /**
   * @param event
   * @return {Promise<void>}
   */
  handleSubmit = async (event) => {
    event.preventDefault();

    let data = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
    };

    console.log(data);

    // https://coursegraph.org/account/login
    await fetch('http://localhost:8080/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  render() {
    return (
      <div className="container">
        <Header/>
        <form className="login-form" onSubmit={this.handleSubmit}>
          <TextField
            required={true}
            id="email"
            label="Email"
            value={this.state.email}
            onChange={this.handleChange('email')}
            margin="normal"
          />
          <TextField
            required={true}
            id="password"
            type="password"
            label="Password"
            value={this.state.password}
            onChange={this.handleChange('password')}
            margin="normal"
          />
          <TextField
            required={true}
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            value={this.state.confirmPassword}
            onChange={this.handleChange('confirmPassword')}
            margin="normal"
          />
          <Button className="button"
                  variant="contained"
                  onClick={this.handleSubmit}
          >Signup</Button>
        </form>
      </div>
    );
  }
}
