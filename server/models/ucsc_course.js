const mongoose = require('mongoose');

const UCSCCourseSchema = new mongoose.Schema({
  description: {type: String},
  division: {type: String},
  geCategories: {type: String},
  instructor: {type: String},
  name: {type: String},
  terms: {type: String},
  title: {type: String},
}, {
  collection: 'ucsc',
});

const Course = mongoose.model('UCSCCourse', UCSCCourseSchema);

module.exports = Course;
