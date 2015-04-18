'use strict';

var utils = require('../common/utils');

var Area = function Area(name, type) {

    if (! (this instanceof Area)) {
        throw new TypeError('Invalid constructor invocation. Did you forget the new keyword?');
    }

    var validateArguments = function() {
        if(!utils.hasText(name)) {
            throw new TypeError('name should be a string');
        }
        if(!(type === Area.INTERACTIVE_TYPE || type === Area.STATIC_TYPE)) {
            throw new Error('type should be a non-empty string');
        }
    };

    this.name = name;
    this.type = type;

    this.getName = function() {
        return this.name;
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

        return this.getName() === that.getName();
    };

    validateArguments();
};

Area.STATIC_TYPE = 'static';
Area.INTERACTIVE_TYPE = 'interactive';

module.exports = Area;
