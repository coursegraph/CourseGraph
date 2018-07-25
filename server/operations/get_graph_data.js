const fs = require('fs');
const path = require('path');

const data = fs.readFileSync(
  path.join(__dirname, '../../data/ucsd_graph_data.json'), 'utf8');

/**
 * @type {Map.<String, object>}
 */
const schoolMap = new Map([
  ['UCSD', data],
]);

/**
 * @param school {string}
 * @return {object}
 */
function getGraphData(school = 'UCSD') {
  const graphData = schoolMap.get(school.toUpperCase());

  if (!graphData) {
    return {};
  }

  return JSON.parse(graphData);
}

module.exports = {getGraphData};
