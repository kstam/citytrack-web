'use strict';

var angular = require('../shims/angular');
var constants = require('../config/constants');
var types = require('../../model/types');
var utils = require('../../common/utils');

module.exports = function($scope, appState, eventService) {

    $scope.shouldShow = function() {
        var type = appState.getType();
        return type === types.regionofinterest ||
            type === types.streetofinterest ||
            type === types.scenicstreets;
    };

    var setDefaults = function() {
        $scope.minPois = appState.getMinPois();
    };

    // WATCHERS
    var minPoisWatcher = function(current, old) {
        if(angular.equals(current, old) || !utils.isInteger(current) || current <= 0) {
            return;
        }
        appState.setMinPois(current);
    };

    var initWatchers = function() {
        $scope.$watch('minPois', minPoisWatcher);
    };

    // LISTENERS

    var minPoisListener = function(event, newMinPois) {
        if (newMinPois !== $scope.minPois) {
            $scope.minPois = newMinPois;
        }
    };

    var initListeners = function() {
        eventService.on(appState.MIN_POIS_CHANGED_EVT, minPoisListener);
    };

    // INITIALIZER
    var initialize = function() {
        setDefaults();
        initWatchers();
        initListeners();
    };

    initialize();
};
