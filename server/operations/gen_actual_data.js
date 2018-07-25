const fs = require('fs');
const mongoose = require('mongoose');

const UCSC = require('../models/ucsc_course');
const UCSD = require('../models/ucsd_courses');

/**
 *   "course_info": {
    "ucsd": {
      "courses": {
 * @param data
 */
function parse_ucsd_courses(data) {
  const courses = Object.values(data.course_info.ucsd.courses);

  let arrOfCourses = [];

  for (const course of courses) {
    arrOfCourses.push(course);
  }

  return arrOfCourses;
}

function gen() {

  mongoose.connect('mongodb://localhost:27017/courses', {useNewUrlParser: true});
  let db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    //ucsd
    let count = 0;
    let data = JSON.parse(fs.readFileSync('../../data/courses.json', 'utf8'));

    data.forEach((obj) => {
      let thing = new UCSC(obj);
      count++;
      thing.save();
    });

    console.log(`Saved ${count}`);

    // ucsd
    count = 0;
    data = JSON.parse(fs.readFileSync('../../data/ucsd_all_data.json', 'utf8'));
    data = parse_ucsd_courses(data);

    data.forEach((obj) => {
      let thing = new UCSD(obj);
      count++;
      thing.save();
    });

    console.log(`Saved ${count}`);
  });
}

gen();
