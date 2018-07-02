'use strict';

/**
 * Module dependencies.
 */
const path = require('path');
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');

/**
 * Controllers (route handlers).
 */

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
});
// const Cat = mongoose.model('Cat', {name: String});
// const kitty = new Cat({name: 'Zildjian'});
// kitty.save().then(() => console.log('meow'));

/**
 * Express configuration.
 */
// Allows you to set port in the project properties.
app.set('port', process.env.PORT || 8080);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'foo',
    cookie: {maxAge: 1209600000}, // two weeks in milliseconds
    store: new MongoStore({
        url: 'mongodb://localhost/test',
        autoReconnect: true,
    })
}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Static routes.
 */
const staticPath = path.join(__dirname, '/');
app.use(express.static(staticPath));

/**
 * Primary app routes.
 */
app.get('/login', (req, res) => {
    res.send('Login page using react');
});

app.get('/secret', passportConfig.isAuthenticated, (req, res) => {
    res.send('secret');
});

/**
 * Start Express server.
 */
app.listen(app.get('port'),
    () => {
        console.log(`App is running at on http://localhost:${app.get('port')} in ${app.get('env')} mode`);
        console.log('  Press CTRL-C to stop\n');
    });
