const mongoose = require('mongoose');

const UCSDCourseSchema = new mongoose.Schema({
  dept: String,
  description: String,
  name: String,
  prereqs: [String],
  title: String,
}, {
  collection: 'ucsd',
});

const Course = mongoose.model('UCSDCourseSchema', UCSDCourseSchema);

module.exports = Course;
