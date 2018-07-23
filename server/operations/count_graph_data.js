const fs = require('fs');

// {
//   "dept": "SOCD",
//   "description": "",
//   "edges_from": [],
//   "edges_to": [
//   74
// ],
//   "id": 75,
//   "label": "SOCD 158",
//   "title": ""
// },

// let count = 0;
let data = JSON.parse(fs.readFileSync('../../data/ucsd_graph_data.json', 'utf8'));

let deptSet = new Set();

for (const obj of data.nodes) {
  if (obj.dept) {
    deptSet.add(obj.dept);
  }
}

for (const dept of deptSet) {
  console.log(dept);
}

console.log(`Saved ${deptSet.size}`);
