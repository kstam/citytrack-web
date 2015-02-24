'use strict';

var angular = require('../shims/angular');

var NgEventService = function($rootScope) {

    var validateEventName = function(eventName) {
        if (typeof eventName !== 'string') {
            throw new Error('eventName needs to be a string object');
        }

        if (eventName.trim().length === 0) {
            throw new Error('eventName cannot be an empty string');
        }
    };

    var validateCallback = function(callback) {
        if (!angular.isFunction(callback)) {
            throw new Error('callback must be a function');
        }
    };

    var broadcastEvent = function(eventName) {
        if (typeof eventName !== 'string') {
            throw new Error('event must be a string value');
        }
        var args = Array.prototype.splice.call(arguments, 0);
        $rootScope.$broadcast.apply($rootScope, args);
    };

    var registerEvent = function(eventName, callback) {
        validateCallback(callback);
        validateEventName(eventName);
        $rootScope.$on(eventName, callback);
    };

    return {
        broadcastEvent: broadcastEvent,
        on: registerEvent
    };
};

module.exports = NgEventService;
