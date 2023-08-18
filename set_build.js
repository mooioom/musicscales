const fs = require('fs');

// Get the current date in ISO format
const currentDate = new Date().toISOString();

// Create an object with the date property
const data = { date: currentDate };

// Convert the object to JSON format
const jsonData = JSON.stringify(data);

// Write the JSON data to a file
fs.writeFile('public/build.json', jsonData, 'utf8', (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Data saved to file');
  }
});