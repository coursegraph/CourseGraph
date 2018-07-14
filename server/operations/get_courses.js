const fs = require('fs');

const data = fs.readFileSync('./data/faker.json', 'utf8');
const parsedData = JSON.parse(data);

function getItem() {
  return parsedData;
}

module.exports = {getItem};
