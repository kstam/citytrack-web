'use strict';

var angular = require('../shims/angular');
var constants = require('../config/constants');
var types = require('../../model/types');
var utils = require('../../common/utils');

module.exports = function($scope, appState, eventService) {

    $scope.shouldShow = function() {
        var type = appState.getType();
        return type === types.regionsofinterest;
    };

    var setDefaults = function() {
        $scope.maxDistance = appState.getMaxDistance();
    };

    // WATCHERS
    var maxDistanceWatcher = function(current, old) {
        if(angular.equals(current, old) || !utils.isInteger(current) || current <= 0) {
            return;
        }
        appState.setMaxDistance(current);
    };

    var initWatchers = function() {
        $scope.$watch('maxDistance', maxDistanceWatcher);
    };

    // LISTENERS

    var maxDistanceListener = function(event, newMaxDistance) {
        if (newMaxDistance !== $scope.maxDistance) {
            $scope.maxDistance = newMaxDistance;
        }
    };

    var initListeners = function() {
        eventService.on(appState.MAX_DISTANCE_CHANGED_EVT, maxDistanceListener);
    };

    // INITIALIZER
    var initialize = function() {
        setDefaults();
        initWatchers();
        initListeners();
    };

    initialize();
};
