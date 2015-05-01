'use strict';

var utils = require('../common/utils');
var latLngBounds = require('leaflet').latLngBounds;
var latLng = require('leaflet').latLng;
var Area = require('./Area');

var AreaPolygon = function AreaPolygon(name, polygon, type) {

    if (!(this instanceof AreaPolygon)) {
        throw new TypeError('Invalid constructor invocation. Did you forget the new keyword?');
    }

    var validateArguments = function() {
        if(!isValidPolygon(polygon)) {
            throw new Error('polygon should be a LatLng Array object');
        }
    };

    validateArguments();

    //invoke parent constructor
    Area.call(this, name, type);

    this.polygon = polygon;

    this.getPolygon = function() {
        return this.polygon;
    };

    this.equals = function(that) {
        if (this === that) {
            return true;
        }

        if (!(that  instanceof AreaPolygon)) {
            return false;
        }

        return this.getName() === that.getName() &&
            equalPolygons(this.getPolygon(), that.getPolygon());
    };

    this.getBoundingBox = function() {
        var minLat = polygon[0].lat;
        var minLng = polygon[0].lng;
        var maxLat = minLat;
        var maxLng = minLng;

        polygon.forEach(function(point) {
            minLat = Math.min(minLat, point.lat);
            minLng = Math.min(minLng, point.lng);
            maxLat = Math.max(maxLat, point.lat);
            maxLng = Math.max(maxLng, point.lng);
        });
        return latLngBounds(latLng(minLat, minLng), latLng(maxLat, maxLng));
    };

    this.getBoundingBoxAsList = function() {
        var bbox = this.getBoundingBox();
        return [
            bbox.getSouth(),
            bbox.getWest(),
            bbox.getNorth(),
            bbox.getEast()
        ];
    };

    this.getPolygonAsList = function() {
        var list = [];
        //disregard the last point as it is a duplicate
        for(var i = 0; i < polygon.length - 2; i++) {
            list.push(polygon[i].lat + ';' + polygon[i].lng);
        }
        return list;
    };
};

function isValidPolygon(polygon) {
    if(utils.isArray(polygon) && polygon.length >= 3) {
        var validPoints = true;
        polygon.forEach(function(latLng) {
           validPoints = validPoints && isValidLatLng(latLng);
        });
        return validPoints && polygon[0].equals(polygon[polygon.length -1]);
    }
    return false;
}

function isValidLatLng(latLng) {
    return utils.isNotNullOrUndefined(latLng) &&
        utils.isNotNullOrUndefined(latLng.lng) &&
        utils.isNotNullOrUndefined(latLng.lat) &&
        utils.isFunction(latLng.equals);
}

function equalPolygons(a, b) {
    var i;
    if (a === b) return true;
    if (!a || !b) return a === b;
    if (a.length !== b.length) return false;

    for (i = 0; i < a.length; i++) {
        if (!a[i].equals(b[i])) {
            return false;
        }
    }
    return true;
}

utils.extend(Area, AreaPolygon);

module.exports = AreaPolygon;
