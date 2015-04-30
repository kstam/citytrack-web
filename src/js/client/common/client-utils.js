'use strict';

var latLng = require('leaflet').latLng;

var utils = {};

utils.extractLatLng = function(feature) {
    return latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
};

utils.extractPolygon = function(feature) {
    var points = feature.geometry.coordinates[0];
    var result = [];
    points.forEach(function(point) {
        result.push(latLng(point[1], point[0]));
    });
    return result;
};

module.exports = utils;
