import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import fetch from 'isomorphic-unfetch';

/**
 * Login Component that provide text fields and submit button.
 * @inheritDoc
 */
class Login extends React.Component {
  static propTypes = {
    // classes: PropTypes.object.isRequired,
  };

  state = {
    email: 'email',
    password: '',
  };

  // Helpers
  handleChange = (email, password) => (event) => {
    this.setState({
      [email]: event.target.value,
      [password]: event.target.value,
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    let data = {
      email: this.state.email,
      password: this.state.password,
    };

    // https://coursegraph.org/account/login
    const res = await fetch('http://localhost:8080/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };

  /**
   * @return {Element}
   */
  render() {
    return (<div>
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

        <Button className="login-button"
                onClick={this.handleSubmit}
        >Login</Button>
        <Button className="login-button-2">
          Login
        </Button>
      </form>
    </div>);
  }
}

export default Login;
