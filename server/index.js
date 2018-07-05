const express = require('express');
const next = require('next');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({dev});
const defaultRequestHandler = app.getRequestHandler();

const LOCAL_DB = 'test';
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/${LOCAL_DB}`;

app.prepare()
    .then(() => {
        const server = express();

        server.use(bodyParser.json());
        server.use((req, res, next) => {
            req.db = db;
            next()
        });

        // MongoDB
        mongoose.Promise = Promise;
        mongoose.connect(MONGODB_URI);
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));

        // Next.js request handling
        const customRequestHandler = (page, req, res) => {
            // Both query and params will be available in getInitialProps({query})
            const mergedQuery = Object.assign({}, req.query, req.params);
            app.render(req, res, page, mergedQuery);
        };

        // Routes
        server.get('/a', (req, res) => {
            return app.render(req, res, '/b', req.query)
        });

        server.get('/b', (req, res) => {
            return app.render(req, res, '/a', req.query)
        });

        server.get('/posts/:id', (req, res) => {
            return app.render(req, res, '/posts', {id: req.params.id})
        });

        server.get('/', customRequestHandler.bind(undefined, '/'));
        server.get('*', defaultRequestHandler);

        server.listen(PORT, (err) => {
            if (err) {
                throw err;
            }
            console.log(`> Ready on http://localhost:${PORT}`)
        })
    });
