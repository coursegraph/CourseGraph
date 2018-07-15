const fs = require('fs');

const data = JSON.parse(fs.readFileSync('../../data/data.json', 'utf8'));

function parseCourss(data) {
  let course = {};
  for (const pair of Object.entries(data)) {

  }
}


for (const pair of Object.entries(data)) {
  let key = pair[0];
  let courses = pair[1].courses;

  if (courses) {
    console.log(`${key}: ${Object.keys(courses).length}`);
  } else {
    console.log(`${key}`);
  }
}



