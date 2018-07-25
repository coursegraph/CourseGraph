const UCSC = require('../models/ucsc_course');
const UCSD = require('../models/ucsd_courses');

/**
 * @type {Map.<string, Model>}
 */
let schoolMap = new Map([
  ['UCSC', UCSC],
  ['UCSD', UCSD],
]);

/**
 * GET / courses
 */
exports.getCourses = (req, res) => {
  const schoolName = req.params.id || 'UCSD';
  const school = schoolMap.get(schoolName.toUpperCase());

  // console.log(`Asking for ${schoolName}...`);

  if (school) {
    school.find({}).lean().exec((err, course) => {
      if (err) {
        return console.error(err);
      }
      return res.json(course);
    });
  } else {
    return res.json([]);
  }
};


