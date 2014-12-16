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

    this.equals = function(that) {
        if (this === that) {
            return true;
        }

        if (! (that  instanceof Area)) {
            return false;
        }

        return this.getName() === that.getName() &&
            equalPoints(this.getCenter(), that.getCenter()) &&
            equalBoundingBoxes(this.getBoundingBox(), that.getBoundingBox());
    };

    validateArguments();
};

function equalPoints(p1, p2) {
    return p1.lng === p2.lng &&
        p1.lat === p2.lat;
}

function equalBoundingBoxes(bb1, bb2) {
    if (bb1.length !== bb2.length) {
        return false;
    }
    return bb1.reduce(function(resultSoFar, point, index) {
        return resultSoFar && equalPoints(point, bb2[index]);
    }, true);
}

module.exports = Area;
