'use strict';
var L = require('leaflet');

L.Icon.Default.imagePath = 'img/vendor/';

var config = {};

// Should not allow hovering over transpositions of the map
config.maxbounds = {
    northEast: {
        lat: 90,
        lng: 180
    },
    southWest: {
        lat: -90,
        lng: -180
    }
};

// Start at the center of the world
config.center = {
    lat: 0,
    lng: 0,
    zoom: 1
};

// Configure where leaflet should get the tiles from
config.tiles = {
    url: 'https://{s}.tiles.mapbox.com/v3/examples.map-i875mjb7/{z}/{x}/{y}.png',
    options: {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>'
    }
};

// Default leaflet configs
config.defaults = {
    minZoom: 1
};

config.bounds = {};

module.exports = config;
