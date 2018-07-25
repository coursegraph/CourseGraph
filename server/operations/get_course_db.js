const Course = require('../models/ucsc_course');

/**
 * @return {Array.<Course>}
 */
function get() {
  let arr = [];

  Course.find({}).lean().exec((err, course) => {
    if (err) {
      console.error(err);
      return;
    }

    arr.push(course);
  });


  return arr;
}

module.exports = get;
