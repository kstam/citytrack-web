'use strict';

var L = require('leaflet');
var utils = require('common/utils');
var leafletConfig = require('client/config/leafletConfig');

L.Icon.Default.imagePath = leafletConfig.imagePath;

var validateElement = function validateElement(element) {
    if (!(utils.isString(element) || utils.isHTMLElement(element))) {
        throw new Error('element should be a string or an HTMLElement');
    }
};

module.exports = function MapView(element) {
    validateElement(element);

    var map;
    var tileLayer;

    var initMap = function() {
        map  = L.map(element).setView([40, 10], 2);
        tileLayer = L.tileLayer(leafletConfig.tileUrl, {
            maxZoom: leafletConfig.maxZoom,
            attribution: leafletConfig.attribution,
            id: leafletConfig.appId
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
