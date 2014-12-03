var L = require('leaflet');
L.Icon.Default.imagePath = 'img/vendor/leaflet/dist/images/';

var TILE_URL = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';
var MAX_ZOOM = 18;
var ATTRIBUTION = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>';
var ID = 'examples.map-i875mjb7';

var tileLayer = L.tileLayer(TILE_URL, {
    maxZoom: MAX_ZOOM,
    attribution: ATTRIBUTION,
    id: ID
});

module.exports = function(mapId) {
    var map = L.map(mapId).setView([20, 10], 3);
    tileLayer.addTo(map);
    return map;
};
