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
            throw new Error('bbox should be a LatLngBounds object');
        }
    };

    this.name = name;
    this.center = center;
    this.bbox = boundingBox;

    this.getName = function() {
        return this.name;
    };

    this.getCenter = function() {
        return this.center;
    };

    this.getBoundingBox = function() {
        return this.bbox;
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
    return p1.equals(p2);
}

function equalBoundingBoxes(bb1, bb2) {
    return bb1.equals(bb2);
}


module.exports = Area;
