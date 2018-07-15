const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  course_title: {type: String, required: true},
  course_number: {type: Number, required: true},
  instructor: {type: String, required: true},
  location: {type: String, required: true},
  time: {type: String, required: true},
  enrolled: {type: String, required: true},
  book: {type: String, required: true},
  course_url: {type: String, required: true},
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;