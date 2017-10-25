'use strict';

// Init Modules
let express = require('express');
let app = express();
let dateMatch = new RegExp(/^(\/)([a-z])\w+((%20)|(\s))(\d{1,2})(,)((%20)|(\s))(\d{4})$/, "i");
let unixMatch = new RegExp(/^(\/)(\d{1,10})$/);

// Serves index.html
app.use(express.static('public'));
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html')
});

// Route for unix timestamps
app.get(unixMatch, function(req, res){
  let unixTime = req.url.substr(1, req.url.length-1);
  let date = new Date(unixTime * 1000);
  
  function digitToMonth(month) {
    let monthText;
    switch(month) {
      case(0):
        monthText = "January";
        break;
      case(1):
        monthText = "February";
        break;
      case(2):
        monthText = "March";
        break;
      case(3):
        monthText = "April";
        break;
      case(4):
        monthText = "May";
        break;
      case(5):
        monthText = "June";
        break;
      case(6):
        monthText = "July";
        break;
      case(7):
        monthText = "August";
        break;
      case(8):
        monthText = "September";
        break;
      case(9):
        monthText = "October";
        break;
      case(10):
        monthText = "November";
        break;
      case(11):
        monthText = "December";
        break;
      }
    return monthText;
  }
  
  let theYear = date.getFullYear();
  let theDay = date.getDate();
  let theMonth = digitToMonth(date.getMonth());
  let naturalTime = theMonth + " " + theDay + ", " + theYear;
  
  res.end(JSON.stringify({unix: unixTime, natural: naturalTime}));
});

// Route for dates
app.get(dateMatch, function(req, res){
  
  let theDate = req.url.replace("/", "").replace(/%20/gi, " ");
  let splitDate = theDate.split(" ");
  
  function parseDay() {
    let day = splitDate[1].replace(/(,)/gi, "");
    if (day.length == 1) day = "0" + day;
    return day;
  }
  
  function monthToDigit() {
    let month = splitDate[0].toUpperCase();
    switch (month) {
      case("JANUARY"):
        month = "00";
        break;
      case("FEBRUARY"):
        month = "01";
        break;
      case("MARCH"):
        month = "02";
        break;
      case("APRIL"):
        month = "03";
        break;
      case("MAY"):
        month = "04";
        break;
      case("JUNE"):
        month = "05";
        break;
      case("JULY"):
        month = "06";
        break;
      case("AUGUST"):
        month = "07";
        break;
      case("SEPTEMBER"):
        month = "08";
        break;
      case("OCTOBER"):
        month = "09";
        break;
      case("NOVEMBER"):
        month = "10";
        break;
      case("DECEMBER"):
        month = "11";
        break;
    }
    return month;
  }
  
  let theDay = parseDay();
  let theMonth = monthToDigit();
  let theYear = splitDate[2];
  let unixDate = new Date(theYear, theMonth, theDay) / 1000;
  
  res.end(JSON.stringify({ unix: unixDate, natural: theDate }));
});
/*
// Send null if invalid route is entered
app.get("/*", function(req, res) {
    res.end(JSON.stringify({unix: null, natural: null}))
});
*/
// Listen for requests
var listener = app.listen(process.env.PORT, function () {
  console.log('Now listening on port: ' + listener.address().port);
});