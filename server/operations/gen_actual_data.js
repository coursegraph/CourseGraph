const fs = require('fs');
const mongoose = require('mongoose');

const Course = require('../models/course');

function gen() {

  mongoose.connect('mongodb://localhost:27017/courses', {useNewUrlParser: true});
  let db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    const data = JSON.parse(fs.readFileSync('../../data/courses.json', 'utf8'));

    data.forEach((obj) => {
      let thing = new Course(obj);
      thing.save();
    });

    console.log('Done');
  });
}

gen();
