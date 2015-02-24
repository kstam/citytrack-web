'use strict';

var L = require('leaflet');
var utils = require('common/utils');
var leafletConfig = require('client/config/leafletConfig');
var deepExtend = require('deep-extend');
var domify = require('domify');
var $ = require('jquery');
var template = require('./map-widget.hbs');

L.Icon.Default.imagePath = leafletConfig.imagePath;

var defaultOptions = {
    center: [40, 10],
    zoom: 2
};

module.exports = function MapWidget(theParent, userOptions) {
    var parent = utils.getElement(theParent);
    var element = domify(template());
    var options = deepExtend({}, defaultOptions, userOptions);
    var map;
    var tileLayer;

    var initMap = function(element, options) {
        map  = L.map(element).setView(options.center, options.zoom);
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

    var setView = function setView(area) {
        utils.verify(utils.isNotNullOrUndefined(area), 'setView: area cannot be null or undefined');
        var center = L.latLng(area.getCenter().lat, area.getCenter().lng);
        var zoom = map.getBoundsZoom(area.getBoundingBox());
        map.setView(center, zoom);
    };

    var initialize = function() {
        $(parent).append(element);
        initMap(element, options);
    };

    initialize();

    return {
        getMap: getMap,
        setView: setView
    };
};
