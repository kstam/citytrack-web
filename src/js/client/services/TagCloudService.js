'use strict';

var $ = require('jquery');
var Area = require('model/Area');
var utils = require('common/utils');
var constants = require('client/config/constants');
var latLngBounds = require('leaflet').latLngBounds;
var latLng = require('leaflet').latLng;

var TagCloudService = function($resource) {

    var StreetTagCloud = $resource('api/streets/:streetId/tagCloud', {streetId: '@id'}, {
        query: {
            method: 'GET',
            params: {}
        }
    });

    var RegionTagCloud = $resource('api/regions/tagCloud', {}, {
        query: {
            method: 'GET',
            params: {}
        }
    });

    var getStreetTagCloud = function(streetId) {
        return StreetTagCloud.query({
            streetId: streetId
        }).$promise;
    };

    var getRegionTagCloud = function(areaPolygon) {
        return RegionTagCloud.query({
            poly: areaPolygon.getPolygonAsList().join(',')
        }).$promise;
    };

    return {
        getStreetTagCloud: getStreetTagCloud,
        getRegionTagCloud: getRegionTagCloud
    };


};

module.exports = TagCloudService;
