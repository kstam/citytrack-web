'use strict';

var utils = {};

var getType = function(obj) {
    return {}.toString.call(obj);
};

utils.isNotNullOrUndefined = function(obj) {
    return (typeof obj !== 'undefined') && obj !== null;
};

utils.isType = function(obj, theType) {
    return utils.isNotNullOrUndefined(obj) &&
            getType(obj) === '[object ' + theType + ']';
};

utils.isString = function(obj) {
    return utils.isType(obj, 'String');
};

utils.isFunction = function(obj) {
    return utils.isType(obj, 'Function');
};

utils.isInteger = function(obj) {
    return typeof(obj) === 'number' &&
        isFinite(obj) &&
        Math.round(obj) === obj;
};

utils.isHTMLElement = function(obj) {
    return utils.isNotNullOrUndefined(obj)
        && utils.isString(obj.innerHTML);
};

module.exports = utils;
