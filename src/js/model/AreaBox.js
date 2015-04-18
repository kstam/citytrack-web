'use strict';

var utils = require('../common/utils');
var Area = require('./Area');

var AreaBox = function AreaBox(name, boundingBox, type) {

    if (! (this instanceof AreaBox)) {
        throw new TypeError('Invalid constructor invocation. Did you forget the new keyword?');
    }

    var validateArguments = function() {
        if(!isValidBbox(boundingBox)) {
            throw new Error('bbox should be a LatLngBounds object');
        }
    };

    //invoke parent constructor
    Area.call(this, name, type);

    this.bbox = boundingBox;

    this.getBoundingBox = function() {
        return this.bbox;
    };

    this.equals = function(that) {
        if (this === that) {
            return true;
        }

        if (! (that  instanceof AreaBox)) {
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

utils.extend(Area, AreaBox);

module.exports = AreaBox;
