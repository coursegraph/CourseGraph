const express = require('express');
const next = require('next');
const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// temp ugly solution
// const api = require('./operations/get-item');
const api = require('./operations/get_courses');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';

const app = next({dev});
const defaultRequestHandler = app.getRequestHandler();

const LOCAL_DB = 'test';
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${LOCAL_DB}`;

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

app.prepare()
  .then(() => {

    /**
     * Create Express server.
     */
    const server = express();

    /**
     * Express configuration.
     */
    server.use(bodyParser.json());
    server.use(compression());
    server.use((req, res, next) => {
      req.db = db;
      next();
    });

    /**
     * Connect to MongoDB.
     */
    mongoose.Promise = Promise;
    mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    /**
     * Primary app routes.
     */
    server.get('/', (req, res) => {
      res.redirect('/ucsc');
    });

    server.get('/posts/:id', (req, res) => {
      return app.render(req, res, '/posts', {id: req.params.id});
    });

    server.get('/foo', passportConfig.isAuthenticated, (req, res) => {
      res.send('hello world');
    });

    /**
     * API routes.
     */
    server.get('/api/courses', (req, res) => {
      const itemData = api.getItem();
      res.json(itemData);
    });

    /**
     * Fall-back on other next.js assets.
     */
    server.get('*', (req, res) => {
      return defaultRequestHandler(req, res);
    });

    /**
     * Start Express server.
     */
    server.listen(PORT, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  });
