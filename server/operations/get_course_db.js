const Course = require('../models/course');

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
