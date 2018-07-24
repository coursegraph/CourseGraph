/**
 * Module dependency
 */
const express = require('express');
const next = require('next');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const LRUCache = require('lru-cache');
const logger = require('morgan');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);


/**
 * Controllers
 */
const homeController = require('./controllers/home');
const courseController = require('./controllers/courses');
const userController = require('./controllers/user');

/**
 * Constant Settings
 */
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
    server.use(expressValidator());
    server.use(compression());
    server.use(logger('dev'));
    server.use(session({
      resave: true,
      saveUninitialized: true,
      secret: 'I LOVE CMPS115',
      cookie: {maxAge: 1209600000}, // two weeks in milliseconds
      store: new MongoStore({
        url: MONGODB_URI,
        autoReconnect: true,
      }),
    }));
    server.use(passport.initialize());
    server.use(flash());

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
    // server.get('/', homeController.index(app));

    server.get('/account/login', userController.getLogin(app));
    server.post('/account/login', userController.postLogin(app));
    server.get('/account/signup', userController.getSignup(app));
    server.post('/account/signup', userController.postSignup(app));

    server.get('/foo', passportConfig.isAuthenticated, (req, res) => {
      res.send('hello world');
    });

    /**
     * API routes.
     */
    server.get('/api/courses/:id', courseController.getCourses);

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
