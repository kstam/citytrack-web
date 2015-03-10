'use strict';

var L = require('leaflet');
var iconFactory = require('./iconFactory');
var types = require('../../model/types');

var DEFAULT_ICON = iconFactory.defaultMarkerIcon();

var markerOptions = {
    icon: DEFAULT_ICON
};

var forPoint = function(feature, latlng) {
    return L.marker(latlng, markerOptions);
};

module.exports = {
    forPoint: forPoint
};
