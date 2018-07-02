'use strict';

/**
 * Module dependencies.
 */
const path = require('path');
const express = require('express');
const compression = require('compression');
// const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');

/**
 * Controllers (route handlers).
 */

/**
 * API keys and Passport configuration.
 */

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
const staticPath = path.join(__dirname, '/');
app.use(express.static(staticPath));


/**
 * Express configuration.
 */
// Allows you to set port in the project properties.
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());

/**
 * Start Express server.
 */
app.listen(app.get('port'),
    () => {
        console.log(`App is running at on http://localhost:${app.get('port')} in ${app.get('env')} mode`);
        console.log('  Press CTRL-C to stop\n');
    });
