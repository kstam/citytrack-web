'use strict';

var utils = {};

var getType = function(obj) {
    return {}.toString.call(obj);
};

utils.isNotNullOrUndefined = function(obj) {
    return (typeof obj !== 'undefined') && obj !== null;
};

utils.isNullOrUndefined = function(obj) {
    return (typeof obj === 'undefined') || obj === null;
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
    if (typeof arg !== 'undefined') {
        return function(verifier) {
            return verifier(arg);
        };
    } else {
        return function() {
            return true;
        };
    }
};

/**
 * Returns an array of strings for a given string array
 * @param stringArray with the format "[a,b,c]"
 * @returns {*} ['a','b','c']
 */
utils.getArrayFromString = function(stringArray) {
    var result = [];
    var values = {};
    if (!utils.isString(stringArray)) {
        return result;
    }
    stringArray.replace('[', '').replace(']', '').split(',').forEach(function(value) {
        value = value.trim();
        if (value !== '') {
            values[value] = true;
        }
    });
    return Object.keys(values);
};

/**
 * Capitalizes each word of a string
 * @param x tHis iS a WeiRd string
 * @returns {*} This Is A Weird String
 */
utils.capitalizeWords = function(x) {
    return x.replace(/(?:^|\s)\S/g, function(a) {
        return a.toUpperCase();
    });
};

/**
 * Returns true if the two arrays have the same content irregardles of the order
 * @param a1
 * @param a2
 * @returns {boolean}
 */
utils.sameContent = function(a1, a2) {
    if (utils.isArray(a1) && utils.isArray(a2)) {
        var i, map1 = {}, map2 = {};
        a1.forEach(function(elm) {
            map1[elm] = true;
        });
        // check if all elements in a2 are in map1
        // construct map2
        for (i = 0; i < a2.length; i++) {
            map2[a2[i]] = true;
            if (!map1[a2[i]]) {
                return false;
            }
        }
        //check if all elements in a1 are in map2
        for (i = 0; i < a1.length; i++) {
            if (!map2[a1[i]]) {
                return false;
            }
        }
        return true;
    } else {
        return a1 === a2;
    }
};

/**
 * Defines correct prototypal inheritance change between base and sub object
 * @param base the father object
 * @param sub the child object
 */
utils.extend = function(base, sub) {
    // Avoid instantiating the base class just to setup inheritance
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
    // for a polyfill
    // Also, do a recursive merge of two prototypes, so we don't overwrite
    // the existing prototype, but still maintain the inheritance chain
    // Thanks to @ccnokes
    var origProto = sub.prototype;
    sub.prototype = Object.create(base.prototype);
    for (var key in origProto) {
        sub.prototype[key] = origProto[key];
    }
    // Remember the constructor property was set wrong, let's fix it
    sub.prototype.constructor = sub;
    // In ECMAScript5+ (all modern browsers), you can make the constructor property
    // non-enumerable if you define it like this instead
    Object.defineProperty(sub.prototype, 'constructor', {
        enumerable: false,
        value: sub
    });
};

module.exports = utils;
