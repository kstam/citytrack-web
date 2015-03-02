'use strict';

var utils = require('../common/utils');

var Area = function Area(name, boundingBox, type) {

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
        if(!(type === Area.INTERACTIVE_TYPE || type === Area.STATIC_TYPE)) {
            throw new Error('type should be a non-empty string');
        }
    };

    this.name = name;
    this.bbox = boundingBox;
    this.type = type;

    this.getName = function() {
        return this.name;
    };

    this.getBoundingBox = function() {
        return this.bbox;
    };

    this.getType = function() {
        return this.type;
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

    this.getBoundingBoxAsList = function() {
        return [
            this.bbox.getSouth(),
            this.bbox.getWest(),
            this.bbox.getNorth(),
            this.bbox.getEast()
        ];
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

Area.STATIC_TYPE = 'static';
Area.INTERACTIVE_TYPE = 'interactive';

module.exports = Area;
