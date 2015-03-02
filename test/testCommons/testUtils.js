'use strict';
var Area = require('model/Area');
var L = require('leaflet');

var testUtils = {};

testUtils.createRandomArea = function(name) {

    var lat = Math.floor(Math.random() * 161 * 1024) / 1024 - 80;
    var lng = Math.floor(Math.random() * 341 * 1024) / 1024 - 170;

    return new Area(name, L.latLngBounds(L.latLng(lat - 10, lng - 10), L.latLng(lat + 10, lng + 10)), 'interactive');
};

testUtils.createRandomAreaServerResult = function(name) {

    var lat = Math.floor(Math.random() * 161 * 1024) / 1024 - 80;
    var lng = Math.floor(Math.random() * 341 * 1024) / 1024 - 170;

    return {
        name: name,
        center: {lat: lat, lng: lng},
        bbox: {minLat: lat - 10, minLng: lng - 10, maxLat: lat + 10, maxLng: lng + 10}
    };
};


testUtils.cloneArea = function(area) {
    return new Area(area.getName(), area.getBoundingBox(), area.getType());
};

module.exports = testUtils;
