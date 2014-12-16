var express = require('express');
var Area = require('../src/js/model/Area');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});


var areas = [
    new Area("London", {lat: 51.507222, lng: -0.1275}, [{lat: 51.27, lng: -0.49},
        {lat: 51.7, lng: 0.24}]),
    new Area("Athens", {lat: 37.966667, lng: 23.716667}, [{lat: 37.8, lng: 23.5},
        {lat: 38.2, lng: 24}]),
    new Area("Vienna", {lat: 48.2, lng: 16.366667}, [{lat:  48.11, lng: 16.18},
        {lat: 48.33, lng: 16.58}])
];

router.get('/areas', function(req, res) {
    res.send(areas);
});

module.exports = router;
