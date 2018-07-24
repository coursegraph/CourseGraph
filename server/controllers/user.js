const {promisify} = require('util');
const crypto = require('crypto');
const passport = require('passport');

const User = require('../models/user');

const randomBytesAsync = promisify(crypto.randomBytes);

/**
 * GET /login
 * Login page.
 * @param app {App} Next app
 * @return {Function}
 */
exports.getLogin = (app) => (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }

  return app.render(req, res, '/account/login', {
    title: 'Login',
  });
};

/**
 * POST /login
 * Sign in using email and password.
 * @param app {App} Next app
 * @return {Function}
 */
exports.postLogin = (app) => (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false});

  const errors = req.validationErrors();

  if (errors) {
    // req.flash('errors', errors);
    return res.redirect('/account/error'); // login
  }

  return passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      // req.flash('errors', info);
      return res.redirect('/account/error');
    }

    return req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      // req.flash('success', {msg: 'Success! You are logged in.'});
      return res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /signup
 * Signup page.
 * @param app
 * @return {Function}
 */
exports.getSignup = (app) => (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }

  return app.render(req, res, '/account/signup', {
    title: 'Create Account',
  });
};

/**
 * POST /signup
 * Create a new local account.
 * @param app
 * @return {Function}
 */
exports.postSignup = (app) => (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(
    req.body.password);
  req.sanitize('email').normalizeEmail({gmail_remove_dots: false});

  const errors = req.validationErrors();

  console.log(req.body);
  console.log(errors);

  if (errors) {
    // req.flash('errors', errors);
    return res.redirect('/account/error');
  }

  /**
   * @type {Model}
   */
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  // Check if the user already exist
  return User.findOne({email: req.body.email}, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      req.flash('errors', {
        msg: 'Account with that email address already exists.',
      });
      return res.redirect('/account/error');
    }

    return user.save((err) => {
      if (err) {
        return next(err);
      }

      return req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        return res.redirect('/');
      });
    });
  });
};
