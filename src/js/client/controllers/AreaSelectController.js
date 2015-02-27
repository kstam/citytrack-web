'use strict';

var angular = require('../shims/angular');

module.exports = function($scope, areaService, appState, eventService) {

    var initConfig = function() {
        $scope.config = {
            create: false,
            maxItems: 1,
            valueField: 'name',
            labelField: 'name',
            openOnFocus: true,
            placeholder: 'Where...'
        };
    };

    var initAreas = function() {
        $scope.areaMap = {};
        $scope.areas = [];
        areaService.getAreas(function(err, areas) {
            if (err instanceof Error) {
                //TODO -
                return;
            }
            $scope.$apply(function() {
                angular.forEach(areas, function(value) {
                    $scope.areaMap[value.getName()] = value;
                });
            });
        });
    };

    var initCurrentArea = function() {
        areaService.getCurrentArea(function(err, currentArea) {
            if (err instanceof Error) {
                //TODO -;
                return;
            }
            $scope.$apply(function() {
                $scope.areaMap[currentArea.getName()] = currentArea;
                $scope.currentArea = currentArea;
            });
        });
    };

    // WATCHERS

    var areaMapWatcher = function(current, old) {
        if (angular.equals(current, old)) {
            return;
        }
        $scope.areas = [];
        angular.forEach(current, function(value) {
            $scope.areas.push(value);
        });
    };

    var selectedAreaIdWathcer = function(current, old) {
        if (angular.equals(current, old)) {
            return;
        }
        $scope.selectedArea = $scope.areaMap[current];
        appState.setArea($scope.selectedArea);
    };

    var initWatchers = function() {
        $scope.$watch('areaMap', areaMapWatcher, true);
        $scope.$watch('selectedAreaId', selectedAreaIdWathcer);
    };

    // EVENT LISTENERS

    var areaChangedListener = function(event, newArea) {
        if (newArea && (!newArea.equals($scope.selectedArea))) {
            $scope.selectedAreaId = newArea.getName();
            var mapEntry = $scope.areaMap[newArea.getName()];
            if (typeof mapEntry !== 'undefined' && (!mapEntry.equals(newArea))) {
                $scope.areaMap[newArea.getName()] = newArea; //update the map entry if it got updated
            }
        }
    };

    var initListeners = function() {
        eventService.on(appState.AREA_CHANGED_EVT, areaChangedListener);
    };

    var initialize = function() {
        initConfig();
        initAreas();
        initCurrentArea();
        initWatchers();
        initListeners();
    };

    initialize();
};
