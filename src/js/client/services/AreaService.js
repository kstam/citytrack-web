'use strict';

var $ = require('jquery');
var Area = require('model/Area');
var AreaBox = require('model/AreaBox');
var AreaCircle = require('model/AreaCircle');
var utils = require('common/utils');
var constants = require('client/config/constants');
var latLngBounds = require('leaflet').latLngBounds;
var latLng = require('leaflet').latLng;

var AreaService = function() {

    var extractArea = function(a) {
        var bbox = latLngBounds(latLng(a.bbox.minLat, a.bbox.minLng), latLng(a.bbox.maxLat, a.bbox.maxLng));
        return new AreaBox(a.name, bbox, Area.STATIC_TYPE);
    };

    var extractAreas = function(areasResponse) {
        var areas = [];
        areasResponse.forEach(function(area) {
            areas.push(extractArea(area));
        });
        return areas;
    };

    var getAreas = function getAreas(callback) {
        $.get('/api/areas')
            .done(function(data) {
                callback(undefined, extractAreas(data));
            })
            .fail(function(jqXHR) {
                callback(new Error(jqXHR.statusText + "(" + jqXHR.status + "): " + jqXHR.responseText));
            });
    };

    var getCurrentArea = function(callback) {
        utils.verify(utils.isFunction(callback), callback + ' is not a valid function');
        var navigator = window.navigator;

        if ((!navigator) || (!navigator.geolocation) || (!navigator.geolocation.getCurrentPosition)) {
            callback(new Error('Browser does not support geolocation'));
        }

        function onSuccess(position) {
            var center = latLng(position.coords.latitude, position.coords.longitude);
            var radius = 1; //km
            callback(undefined, new AreaCircle(constants.CURRENT_AREA_ID, center, radius, Area.INTERACTIVE_TYPE));
        }

        function onError(error) {
            callback(error, undefined);
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    };

    return {
        getAreas: getAreas,
        getCurrentArea: getCurrentArea
    };
};

module.exports = AreaService;
