const fs = require('fs');

const data = fs.readFileSync('./data/location.json', 'utf8');
const parsedData = JSON.parse(data);

function getItem() {
  return parsedData;
}

module.exports = {getItem};
