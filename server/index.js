const express = require('express');
const next = require('next');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const api = require('./operations/get-item');


const PORT = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';

const app = next({dev});
const defaultRequestHandler = app.getRequestHandler();

const LOCAL_DB = 'test';
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${LOCAL_DB}`;

app.prepare()
  .then(() => {
    const server = express();

    server.use(bodyParser.json());
    server.use((req, res, next) => {
      req.db = db;
      next();
    });

    // MongoDB
    mongoose.Promise = Promise;
    mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

    // Routes
    server.get('/', (req, res) => {
      res.redirect('/ucsc');
    });

    server.get('/posts/:id', (req, res) => {
      return app.render(req, res, '/posts', {id: req.params.id});
    });

    // When rendering client-side, we will request the same data from this route
    server.get('/_data/item', (req, res) => {
      const itemData = api.getItem();
      res.json(itemData);
    });

    // Fall-back on other next.js assets.
    server.get('*', (req, res) => {
      return defaultRequestHandler(req, res);
    });

    // Start the server
    server.listen(PORT, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  });
