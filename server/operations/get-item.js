const fs = require('fs');

// In this case, data read from the fs, but it could also be a cached API result
const data = fs.readFileSync('./data/course_title.json', 'utf8');
const parsedData = JSON.parse(data);

function getItem() {
  return parsedData;
}

module.exports = {getItem};
