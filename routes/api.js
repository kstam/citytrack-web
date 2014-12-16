var express = require('express');
var Area = require('../src/js/model/Area');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});


var areas = [
    new Area('Athens',
        {lat: 20, lng:50},
        [{lat: 10, lng: 30}, {lat: 30, lng: 60}]),
    new Area('Zurich',
        {lat: 20, lng:50},
        [{lat: 10, lng: 30}, {lat: 30, lng: 60}]),
    new Area('London',
        {lat: 20, lng:50},
        [{lat: 10, lng: 30}, {lat: 30, lng: 60}])
];

router.get('/areas', function(req, res) {
   res.send(areas);
});

module.exports = router;
