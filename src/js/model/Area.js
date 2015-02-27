'use strict';

var utils = require('../common/utils');

var Area = function Area(name, boundingBox) {

    if (! (this instanceof Area)) {
        throw new TypeError('Invalid constructor invocation. Did you forget the new keyword?');
    }

    var validateArguments = function() {
        if(!utils.hasText(name)) {
            throw new TypeError('name should be a string');
        }
        if(!isValidBbox(boundingBox)) {
            throw new Error('bbox should be a LatLngBounds object');
        }
    };

    this.name = name;
    this.bbox = boundingBox;

    this.getName = function() {
        return this.name;
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
            equalBoundingBoxes(this.getBoundingBox(), that.getBoundingBox());
    };

    validateArguments();
};

function isValidBbox(bb) {
    return  utils.isNotNullOrUndefined(bb) &&
            utils.isFunction(bb.getNorthEast) &&
            utils.isFunction(bb.getSouthWest) &&
            utils.isFunction(bb.equals);
}

function equalBoundingBoxes(bb1, bb2) {
    return bb1.equals(bb2);
}

module.exports = Area;
