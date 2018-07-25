const fs = require('fs');


const data = JSON.parse(
  fs.readFileSync('../../data/ucsd_all_data.json', 'utf8'));

const vizjs = data.course_info.ucsd.vizjs;

// for (const entry of Object.entries(courses)) {
//   let key = entry[0];
//   let value = entry[1];
// }

fs.writeFile('../../data/ucsd_graph_data.json', JSON.stringify(vizjs), (err) => {
  if (err) {
    throw err;
  }
  console.log('The file has been saved!');
});

