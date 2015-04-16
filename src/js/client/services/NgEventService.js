'use strict';

var angular = require('../shims/angular');
var utils = require('../../common/utils');

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

    var unregisterEvent = function(event, callback) {
        var listeners = $rootScope.$$listeners[event];
        var result = 0;
        if (utils.isArray(listeners)) {
            var listenerIndexes = [];
            listeners.forEach(function(listener, idx) {
                if(listener === callback) {
                    listenerIndexes.push(idx);
                }
            });
            listenerIndexes.forEach(function(idx) {
                listeners[idx] = null;
                result += 1;
            });
        }
        return result;
    };

    var registerOnce = function(eventName, callback) {
        validateCallback(callback);
        validateEventName(eventName);
        var unregisterHandler = $rootScope.$on(eventName, function() {
            var args = Array.prototype.splice.call(arguments, 0);
            callback.apply(undefined, args);
            unregisterHandler();
        });
    };

    return {
        broadcastEvent: broadcastEvent,
        on: registerEvent,
        once: registerOnce,
        off: unregisterEvent
    };
};

module.exports = NgEventService;
