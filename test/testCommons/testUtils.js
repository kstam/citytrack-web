'use strict';
var Area = require('model/Area');

var testUtils = {};

testUtils.createRandomArea = function (name) {

    var lat = Math.floor(Math.random() * 161 * 1024) / 1024 - 80;
    var lng = Math.floor(Math.random() * 341 * 1024) / 1024 - 170;

    return new Area(name, {lat: lat, lng: lng}, [{lat: lat-10, lng: lng-10}, {lat: lat+10, lng: lng+10}]);
};

testUtils.createRandomAreaServerResult = function (name) {

    var lat = Math.floor(Math.random() * 161 * 1024) / 1024 - 80;
    var lng = Math.floor(Math.random() * 341 * 1024) / 1024 - 170;

    return {name: name,
        center: {lat: lat, lng: lng},
        bbox: {minLat: lat-10, minLng: lng-10, maxLat: lat+10, maxLng: lng+10}};
};



testUtils.cloneArea = function(area) {
   return new Area(area.getName(), area.getCenter(), area.getBoundingBox());
};

module.exports = testUtils;
