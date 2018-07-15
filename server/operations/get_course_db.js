const Course = require('../models/course');

/**
 * @param title {string}
 * @return {Array.<Course>}
 */
function get(title) {
  let arr = [];

  Course.find({}, (err, course) => {
    if (err) {
      return console.error(err);
    }

    arr.push(course);
  });

  return arr;
}

module.exports = get;
