const fs = require('fs');
const mongoose = require('mongoose');

const Course = require('../models/course');
const faker = require('faker');

mongoose.connect('mongodb://localhost:27017/faker', {useNewUrlParser: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  let arr = [];

  for (let i = 0; i < 5000; i++) {
    const data = {
      course_title: faker.company.companyName(),
      course_number: faker.random.number(),
      instructor: faker.name.findName(),
      location: faker.address.streetAddress(),
      time: faker.date.recent(),
      enrolled: faker.random.number(),
      book: faker.internet.url(),
      course_url: faker.internet.url(),
    };

    arr.push(data);
    let dbDate = new Course(data);
    dbDate.save();
  }

  fs.writeFile('data/faker.json', JSON.stringify(arr), (err) => {
    if (err) {
      throw err;
    }
    console.log('The file has been saved!');
  });
});



