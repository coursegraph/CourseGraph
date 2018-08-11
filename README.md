<p align="center">

![coursegraph](./assets/logo.png)

[![Build Status](https://travis-ci.org/coursegraph/CourseGraph.svg?branch=development)](https://travis-ci.org/coursegraph/CourseGraph)
[![Coverage Status](https://coveralls.io/repos/github/coursegraph/CourseGraph/badge.svg)](https://coveralls.io/github/coursegraph/CourseGraph)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/coursegraph/CourseGraph/blob/master/LICENSE.md)

</p>

## Introduction

The course search software offered by UCSC (and most colleges) kind of sucks, and there is no easy way to explore classes and majors without a counselor – and the counselors could probably use some help too!

Solution? CourseGraph, a webapp that will:

+ datamine pisa and the registrar for course information and sections (and major / minor requirements if we can do that)
+ display this information visually as a web of interdependent courses and major requirements, filterable and presented through different layers and views

Technology: we will need

 + a web frontend (probably React, vis.js, material-ui) and people interested in UX and software design (myself included)
 + a web backend (probably node, mongoDB) and people interested in backend development and data storage / retrieval
 + several web crawlers to datamine UCSC sites and maybe others; anyone interested in this please apply!
+ possible integration of other web services (if we could embed eg. ratemyprofessors that would be awesome)

Is this feasible in <5 weeks?

 + Yes, but it will be challenging as we'll have a lot of work to do
 + Plus side is we all get to wear lots of hats and use a lot of cool tech to build a real tool that students and counselors can use to explore class options and make planning schedules a lot easier
 + This project can be subdivided with 2-3 teams working in parallel on different components (eg. frontend and data mining), so we should be able to work without too many bottlenecks

You do NOT need to have experience with react, node, or Vis to join this project, just a good attitude and a willingness to learn and contribute.

That said, you will need time to learn a bit of typescript and either frontend (react, vis.js), backend (node, databases – ask Ivan), or data mining (web crawlers, either node or python), since we'll probably be splitting into sub-teams that focus on one of those categories. And you'll need to do this fairly quickly (ie. over the next few weeks) since we'll need to hit the ground running as soon as possible. Oh, and if you'd like to do project management (as one of your many hats) that would be very useful too.

I'll be learning react and vis.js over the next week or so, so if you're interested in that (whether you're a part of this team or not) please hit me up! (ssemery@ucsc.edu)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. (To developers) See deployment for notes on how to deploy the project on a live system.

### Prerequisites

[Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
[mongoDB] (https://docs.mongodb.com/manual/installation/) - MongoDB is an open-source document database that provides high performance, high availability, and automatic scaling.

The minimum supported Node version is `v6.0.0` by default. (We are using `v10.0.0`).

```
node --version

// v10.0.0
```

### Installing

Clone our repository (or unzip the project and cd into the root folder),

```
git clone https://github.com/coursegraph/CourseGraph myProject
cd myProject
```

And install dependencies, via [`npm`](https://www.npmjs.com/) (installed with Node.js).

```
npm install
```

### Running the project

Running the project is as simple as running

```
npm run dev
```

This runs the `dev` script specified in our `package.json`, and will spawn off a server which reloads the page as we save our files. Typically the server runs at `http://localhost:3000`, but should be automatically opened for you.

## Running the tests

Testing is also just a command away:

```
npm run test
```

This command runs [`jest`](http://jestjs.io/) and [`enzyme`](http://airbnb.io/enzyme/), an incredibly useful testing utility.

## Built With

* [Next.js](https://nextjs.org/) - A lightweight framework for static and server‑rendered applications.
* [React](https://reactjs.org) - A JavaScript library for building user interfaces
* [Node.js](https://nodejs.org/en/) - A JavaScript runtime built on Chrome's V8 JavaScript engine.
* [MongoDB](https://www.mongodb.com/) - Build innovative modern applications that create a competitive advantage.

## Dependencies
* [Material-ui/core]
* [material-ui/icons]
* [algoliasearch]
* [bcrypt-nodejs]
* [body-parser]
* [compression]
* [connect-mongo'
* [crypto]
* [express]
* [express-flash]
* [express-session]
* [express-validator]
* [isomorphic-unfetch]
* [jss]
* [lru-cache]
* [mongoose]
* [next]
* [npgrogress]
* [passport]
* [passport-local]
* [prop-types]
* [qs]
* [react]
* [react-dom]
* [react-draggable]
* [react-graph-vis]
* [react-instantsearc]
* [react-jss]
* [reactjs-popup]
* [styled-jsx]


## Authors

* **Seiji Emery** ([SeijiEmery](https://github.com/SeijiEmery) ) - Lead Tech Developer
* **Yanwen Xu** ([RaiderSoap](https://github.com/RaiderSoap) ) - :floppy_disk: Back-End Developer
* **Patrick Lauderdale** ([ThePatrickLauderdale](https://github.com/ThePatrickLauderdale)) - FrontEnd Developer
* **Wendy Liang** ([wendyrliang](https://github.com/wendyrliang) ) - FrontEnd Developer
* **Ka Ho Tran** ([Kutaho](https://github.com/Kutaho) ) - FrontEnd Developer
* **Nikki Miller** ([NikMills](https;//github.com/nikmills)) - FrontEnd Developer

See also the list of [contributors](https://github.com/coursegraph/CourseGraph/settings/collaboration) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Big thanks to Richard Jullig.

:kissing_heart: