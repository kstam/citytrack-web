'use strict';

var L = require('leaflet');
var types = require('../../model/types');

var myIcon = L.icon({
    iconUrl: 'img/marker-icon.png',
    iconRetinaUrl: 'img/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -41]
});

var markerOptions = {
    icon: myIcon
};

var forPoint = function(feature, latlng) {
    return L.marker(latlng, markerOptions);
};

module.exports = {
    forPoint: forPoint
};
