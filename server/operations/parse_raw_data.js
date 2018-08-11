const fs = require('fs');

const data = JSON.parse(fs.readFileSync('../../data/data.json', 'utf8'));

const courseTemplate = Object.keys({
  description: '',
  division: '',
  geCategories: '',
  instructor: '',
  name: '',
  terms: '',
  title: '',
});

let arr = [];

/**
 * @param obj
 * @return {boolean}
 */
function check(obj) {
  courseTemplate.forEach((template) => {
    if (!obj.hasOwnProperty(template)) {
      if (typeof obj[template] !== 'string') {
        return false;
      }
    }
  });

  return true;
}

function parseCourse(data) {
  let courses = Object.values(data);
  for (const obj of courses) {
    if (check) {
      arr.push(obj);
    } else {
      console.log('Something wrong with the data: ');
      console.log(data);
    }
  }
}

let count = 0;
for (const pair of Object.entries(data)) {
  let key = pair[0];
  let courses = pair[1].courses;

  count++;
  if (courses) {
    console.log(`${key}: ${Object.keys(courses).length}`);

    parseCourse(courses);
  } else {
    console.log(`${key}`);
  }
}
console.log(count);

fs.writeFile('../../data/courses.json', JSON.stringify(arr), (err) => {
  if (err) {
    throw err;
  }
  console.log('The file has been saved!');
});

