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
    return (typeof obj === 'string');
};

utils.hasText = function(obj) {
    return utils.isString(obj) && obj.length > 0;
};

utils.isFunction = function(obj) {
    return utils.isType(obj, 'Function');
};

utils.isArray = function(obj) {
    return utils.isType(obj, 'Array');
};

utils.verify = function(expr, msg) {
    var message = msg || '';
    if (!expr) {
        throw new Error(message);
    }
};

utils.isInteger = function(obj) {
    return typeof(obj) === 'number' &&
        isFinite(obj) &&
        Math.round(obj) === obj;
};

utils.isHTMLElement = function(obj) {
    return utils.isNotNullOrUndefined(obj) &&
        utils.isString(obj.innerHTML);
};

utils.getElement = function(element) {
    if (utils.isString(element) && element.length > 0) {
        return document.getElementById(element);
    } else if (utils.isHTMLElement(element)) {
        return element;
    } else {
        throw new Error('element should be a string or an HTMLElement');
    }
};

/**
 * Returns false only if the argument is set and the verifier returns false for the argument.
 * The verifier is invoked only if the argument is set
 * @param arg
 * @returns {Function} Accepts a verifier which it applies on the argument if the argument is set
 */
utils.optional = function(arg) {
    if (utils.isNotNullOrUndefined(arg)) {
        return function(verifier) {
            return verifier(arg);
        };
    } else {
        return function() {
            return true;
        };
    }
};

module.exports = utils;
