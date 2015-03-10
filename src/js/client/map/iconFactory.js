'use strict';

var angular = require('../shims/angular');
var L = require('leaflet');

var DEFAULT_ICON_OPTIONS = {
    iconUrl: 'img/marker-icon.png',
    iconRetinaUrl: 'img/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -41]
};

var HOVER_ICON_URL = {
    iconUrl: 'img/marker-icon-hover.png',
    iconRetinaUrl: 'img/marker-icon-hover-2x.png'
};

var CLICKED_ICON_URL = {
    iconUrl: 'img/marker-icon.png',
    iconRetinaUrl: 'img/marker-icon-2x.png'
};

var defaultIcon, hoverIcon, clickedIcon;

var defaultMarkerIcon = function() {
    defaultIcon = defaultIcon || L.icon(DEFAULT_ICON_OPTIONS);
    return defaultIcon;
};

var hoverMarkerIcon = function() {
    hoverIcon = hoverIcon || L.icon(angular.extend({}, DEFAULT_ICON_OPTIONS, HOVER_ICON_URL));
    return hoverIcon
};

var clickedMarkerIcon = function() {
    clickedIcon = defaultIcon || L.icon(angular.extend({}, DEFAULT_ICON_OPTIONS, CLICKED_ICON_URL));
    return clickedIcon;
};

module.exports = {
    hoverMarkerIcon: hoverMarkerIcon,
    defaultMarkerIcon: defaultMarkerIcon,
    clickedMarkerIcon: clickedMarkerIcon
};
