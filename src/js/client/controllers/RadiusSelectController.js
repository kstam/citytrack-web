'use strict';

var angular = require('../shims/angular');
var Area = require('../../model/Area');
var utils = require('../../common/utils');
var AreaCircle = require('../../model/AreaCircle');
var constants = require('../config/constants');

module.exports = function($scope, appState, eventService) {

    $scope.isCircleArea = function() {
        return (appState.getArea() instanceof AreaCircle);
    };

    // WATCHERS
    var radiusWatcher = function(current, old) {
        if(angular.equals(current, old) || !utils.isType(current, 'Number') || current <= 0) {
            return;
        }
        var area = appState.getArea();
        if (area instanceof AreaCircle) {
            appState.setArea(new AreaCircle(area.getName(), area.getCenter(), current, area.getType()));
        }
    };

    var initWatchers = function() {
        $scope.$watch('radius', radiusWatcher);
    };

    // LISTENERS

    var areaChangedListener = function() {
        var newArea = appState.getArea();
        if (newArea instanceof AreaCircle) {
            $scope.radius = newArea.getRadius();
        }
    };

    var initListeners = function() {
        eventService.on(appState.AREA_CHANGED_EVT, areaChangedListener);
    };

    // INITIALIZER
    var initialize = function() {
        initWatchers();
        initListeners();
    };

    initialize();
};
