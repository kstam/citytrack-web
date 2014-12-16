'use strict';

var utils = require('../common/utils');

var Area = function Area(name, center, boundingBox) {

    if (! (this instanceof Area)) {
        throw new TypeError('Invalid constructor invocation. Did you forget the new keyword?');
    }

    var validateArguments = function() {
        if(!utils.hasText(name)) {
            throw new TypeError('name should be a string');
        }
        if(!utils.isNotNullOrUndefined(center)) {
            throw new Error('center should be LatLng object');
        }
        if(!utils.isNotNullOrUndefined(boundingBox)) {
            throw new Error('boundingBox should be a LatLngBounds object');
        }
    };

    this.name = name;
    this.center = center;
    this.boundingBox = boundingBox;

    this.getName = function() {
        return this.name;
    };

    this.getCenter = function() {
        return this.center;
    };

    this.getBoundingBox = function() {
        return this.boundingBox;
    };

    validateArguments();
};

module.exports = Area;
