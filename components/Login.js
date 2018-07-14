import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Login extends React.Component {
  static propTypes = {
    // classes: PropTypes.object.isRequired,
  };
  state = {
    email: 'email here',
    password: '',
  };
  handleChange = (email, password) => (event) => {
    this.setState({
      [email]: event.target.value,
      [password]: event.target.value,
    });
  };

  render() {
    return (<div>
      <form className="login-form">
        <TextField
          required
          id="email"
          label="Email"
          value={this.state.email}
          onChange={this.handleChange('email')}
          margin="normal"
        />
        <TextField
          required
          id="password"
          label="Password"
          value={this.state.password}
          onChange={this.handleChange('password')}
          margin="normal"
        />

        <Button className="login-button">Login</Button>
        <Button color="primary" className="login-button-2">
          Register
        </Button>
      </form>
    </div>);
  }
}

export default Login;
