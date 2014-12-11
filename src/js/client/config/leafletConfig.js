'use strict';

var leafletConfig = {};

leafletConfig.imagePath = '/img/vendor';
leafletConfig.tileUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
leafletConfig.maxZoom = 18;
leafletConfig.appId = 'examples.map-i875mjb7';
leafletConfig.attribution =
    'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';

module.exports = leafletConfig;
