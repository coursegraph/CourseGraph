const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  description: {type: String},
  division: {type: String},
  geCategories: {type: String},
  instructor: {type: String},
  name: {type: String},
  terms: {type: String},
  title: {type: String},
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
