'use strict';

var angular = require('../shims/angular');
var Area = require('../../model/Area');
var utils = require('../../common/utils');
var AreaCircle = require('../../model/AreaCircle');
var constants = require('../config/constants');

module.exports = function($scope, areaService, appState, eventService) {

    $scope.isCircleArea = function() {
        return (appState.getArea() instanceof AreaCircle);
    };

    var addAreaToMap = function (area) {
        $scope.areaMap[area.getName()] = area;
    };

    var removeFromMap = function (id) {
       delete $scope.areaMap[id];
    };

    var initConfig = function() {
        var renderAreaOption = function(item) {
            if (item instanceof AreaCircle) {
                return '<div>Around: ' + item.name + '</div>';
            }
            return '<div>' + item.name + '</div>';
        };
        $scope.config = {
            optgroups: [
                {$order: 2, id: Area.STATIC_TYPE, name: 'From the server'},
                {$order: 1, id: Area.INTERACTIVE_TYPE, name: 'Interactive'}
            ],
            create: false,
            maxItems: 1,
            valueField: 'name',
            labelField: 'name',
            searchField: 'name',
            optgroupField: 'type',
            optgroupLabelField: 'name',
            optgroupValueField: 'id',
            lockOptgroupOrder: true,
            openOnFocus: true,
            placeholder: 'Location...',
            render: {
                item: renderAreaOption,
                option: renderAreaOption
            }
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
                angular.forEach(areas, function(area) {
                    addAreaToMap(area);
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
                addAreaToMap(currentArea);
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
        if (current !== constants.CURRENT_VIEW_ID) {
            removeFromMap(constants.CURRENT_VIEW_ID);
        }
    };

    var initWatchers = function() {
        $scope.$watch('areaMap', areaMapWatcher, true);
        $scope.$watch('selectedAreaId', selectedAreaIdWathcer);
    };

    // EVENT LISTENERS

    var areaChangedListener = function() {
        var newArea = appState.getArea();
        if (newArea && (!newArea.equals($scope.selectedArea))) {
            $scope.selectedAreaId = newArea.getName();
            addAreaToMap(newArea);
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
