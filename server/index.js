const express = require('express');
const next = require('next');
const compression = require('compression');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const LRUCache = require('lru-cache');

// temp ugly solution
const api = require('./operations/get_course_db');
const Course = require('./models/course');

const PORT = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';

const app = next({dev});
const defaultRequestHandler = app.getRequestHandler();

const LOCAL_DB = 'courses';
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017/${LOCAL_DB}`;

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * This is where we cache our rendered HTML pages
 * @type {LRUCache}
 */
const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60, // 1hour
});

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

    /**
     * Connect to MongoDB.
     */
    mongoose.Promise = Promise;
    mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    server.use((req, res, next) => {
      // Expose the MongoDB database handle so Next.js can access it.
      req.db = db;
      next();
    });

    /**
     * Primary app routes.
     */
    server.get('/', (req, res) => {
      res.redirect('/ucsc');
    });

    server.get('/foo', passportConfig.isAuthenticated, (req, res) => {
      res.send('hello world');
    });

    /**
     * API routes.
     */
    server.get('/api/courses/:id', (req, res) => {
      Course.find({course_title: req.params.id}).lean().exec((err, course) => {
        if (err) {
          return console.error(err);
        }

        return res.json(course);
      });
    });

    server.get('/api/courses/', (req, res) => {
      Course.find({}).lean().exec((err, course) => {
        if (err) {
          return console.error(err);
        }
        return res.json(course);
      });
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
  }).catch(error => console.error(error.stack));


/**
 * @param req
 * @return {string}
 */
function getCacheKey(req) {
  return `${req.url}`;
}

/**
 * @param req
 * @param res
 * @param pagePath
 * @param queryParams
 * @return {Promise<void>}
 */
async function renderAndCache(req, res, pagePath, queryParams) {
  const key = getCacheKey(req);

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    res.setHeader('x-cache', 'HIT');
    res.send(ssrCache.get(key));
    return;
  }

  try {
    // If not let's render the page into HTML
    const html = await app.renderToHTML(req, res, pagePath, queryParams);

    // Something is wrong with the request, let's skip the cache
    if (res.statusCode !== 200) {
      res.send(html);
      return;
    }

    // Let's cache this page
    ssrCache.set(key, html);

    res.setHeader('x-cache', 'MISS');
    res.send(html);
  } catch (err) {
    app.renderError(err, req, res, pagePath, queryParams);
  }
}
