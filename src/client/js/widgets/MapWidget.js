var L = require('leaflet');

'use strict';

L.Icon.Default.imagePath = 'img/vendor/leaflet';

var TILE_URL = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
var MAX_ZOOM = 18;
var ATTRIBUTION = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';
var ID = 'examples.map-i875mjb7';

module.exports = function MapView(elementId) {

    var map;
    var tileLayer;

    var initMap = function() {
        map  = L.map(elementId).setView([20, 10], 3);
        tileLayer = L.tileLayer(TILE_URL, {
            maxZoom: MAX_ZOOM,
            attribution: ATTRIBUTION,
            id: ID
        });
        tileLayer.addTo(map);
    };

    var getMap = function getMap() {
        return map;
    };

    initMap();

    return {
        getMap: getMap
    };
};
