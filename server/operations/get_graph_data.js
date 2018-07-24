const fs = require('fs');
const path = require('path');

const data = fs.readFileSync(
  path.join(__dirname, '../../data/ucsd_graph_data.json'), 'utf8');

const parsedData = JSON.parse(data);

function getItem() {
  return parsedData;
}

module.exports = {getItem};
