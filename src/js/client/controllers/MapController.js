'use strict';

var angular = require('../shims/angular');
var config = require('../config/leafletConfig');
var Area = require('../../model/Area');
var constants = require('../config/constants');
var L = require('leaflet');

module.exports = function($scope, appState, eventService) {

    var initCurrentView = function() {
        var bounds = L.latLngBounds(config.maxbounds.southWest, config.maxbounds.northEast);
        $scope.currentView = new Area(constants.CURRENT_VIEW_ID, bounds);
        appState.setArea($scope.currentView);
    };

    var setDefaults = function() {
        angular.extend($scope, config);
    };

    // WATCHERS

    var boundsWatcher = function(newBounds, oldBounds) {
        if (angular.equals(newBounds, oldBounds)) {
            return;
        }
        var cv = $scope.currentView;
        var newBbox = L.latLngBounds($scope.bounds.southWest, $scope.bounds.northEast);
        $scope.currentView = new Area(constants.CURRENT_VIEW_ID, newBbox);
        appState.setArea($scope.currentView);
    };

    var initWatchers = function() {
        $scope.$watch('bounds', boundsWatcher, true);
    };

    // LISTENERS

    var areaChangedListener = function(event, newArea) {
        if (newArea && (!newArea.equals($scope.currentView))) {
            var newBbox = newArea.getBoundingBox();

            $scope.currentView = newArea;

            angular.extend($scope.bounds, {
                northEast: {
                    lat: newBbox.getNorth(),
                    lng: newBbox.getEast()
                },
                southWest: {
                    lat:newBbox.getSouth(),
                    lng:newBbox.getWest()
                }
            });
        }
    };

    var initEventListeners = function() {
        eventService.on(appState.AREA_CHANGED_EVT, areaChangedListener);
    };

    var initialize = function() {
        setDefaults();
        initCurrentView();
        initWatchers();
        initEventListeners();
    };

    initialize();
};
