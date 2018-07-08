const express = require('express');
const next = require('next');
const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// temp ugly solution
// const api = require('./operations/get-item');
const classTime = require('./operations/get_class_time');
const courseNumber = require('./operations/get_course_number');
const courseTitle = require('./operations/get_course_title');
const instructor = require('./operations/get_instructor');
const location = require('./operations/get_location');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';

const app = next({dev});
const defaultRequestHandler = app.getRequestHandler();

const LOCAL_DB = 'test';
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${LOCAL_DB}`;

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

    /**
     * API routes.
     */
    server.get('/api/time', (req, res) => {
      const itemData = classTime.getItem();
      res.json(itemData);
    });

    server.get('/api/number', (req, res) => {
      const itemData = courseNumber.getItem();
      res.json(itemData);
    });

    server.get('/api/title', (req, res) => {
      const itemData = courseTitle.getItem();
      res.json(itemData);
    });

    server.get('/api/instructor', (req, res) => {
      const itemData = instructor.getItem();
      res.json(itemData);
    });

    server.get('/api/location', (req, res) => {
      const itemData = location.getItem();
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
