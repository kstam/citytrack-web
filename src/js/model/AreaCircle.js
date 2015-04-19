'use strict';

var utils = require('../common/utils');
var latLngBounds = require('leaflet').latLngBounds;
var latLng = require('leaflet').latLng;
var Area = require('./Area');

var AreaCircle = function AreaCircle(name, center, radius, type) {
    var EARTH_RADIUS = 6371;

    if (!(this instanceof AreaCircle)) {
        throw new TypeError('Invalid constructor invocation. Did you forget the new keyword?');
    }

    var validateArguments = function() {
        if(!isValidLatLng(center)) {
            throw new Error('center should be a LatLng object');
        }
        if(utils.isNullOrUndefined(radius) || radius <= 0) {
            throw new Error('radius should be a positive number');
        }
    };

    validateArguments();

    //invoke parent constructor
    Area.call(this, name, type);

    this.center = center;
    this.radius = radius;

    this.getCenter= function() {
        return this.center;
    };

    this.getRadius = function() {
        return this.radius;
    };

    this.equals = function(that) {
        if (this === that) {
            return true;
        }

        if (!(that  instanceof AreaCircle)) {
            return false;
        }

        return this.getName() === that.getName() &&
            this.getCenter().equals(that.getCenter()) &&
            this.getRadius() === that.getRadius();
    };

    this.getBoundingBox = function() {
        var angDist = radius / EARTH_RADIUS;
        var latDif = angDist * 180 / Math.PI;
        var lngDif = 2 * Math.asin(Math.sin(angDist/2) * Math.cos(this.center.lat)) * 180 / Math.PI;
        var south = this.center.lat - lngDif;
        var north = this.center.lat + lngDif;
        var east = this.center.lng + latDif;
        var west = this.center.lng - latDif;
        return latLngBounds(latLng(south, west), latLng(north, east));
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

    this.getCenterAsList = function() {
        return [
            this.center.lat,
            this.center.lng
        ];
    };
};

function isValidLatLng(latLng) {
    return utils.isNotNullOrUndefined(latLng) &&
        utils.isNotNullOrUndefined(latLng.lng) &&
        utils.isNotNullOrUndefined(latLng.lat) &&
        utils.isFunction(latLng.equals);
}

utils.extend(Area, AreaCircle);

module.exports = AreaCircle;
