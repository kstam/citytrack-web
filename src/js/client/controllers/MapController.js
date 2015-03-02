'use strict';

var angular = require('../shims/angular');
var config = require('../config/leafletConfig');
var Area = require('../../model/Area');
var constants = require('../config/constants');
var L = require('leaflet');

module.exports = function($scope, appState, eventService) {

    $scope.applyCurrentView = function() {
        appState.setArea($scope.currentView);
        $scope.displayUpdateCurrentView = false;
    };

    var initCurrentView = function() {
        var bounds = L.latLngBounds(config.maxbounds.southWest, config.maxbounds.northEast);
        $scope.displayUpdateCurrentView = false;
        $scope.currentView = new Area(constants.CURRENT_VIEW_ID, bounds, Area.INTERACTIVE_TYPE);
    };

    var setDefaults = function() {
        angular.extend($scope, config);
    };

    var updateDisplayUpdateCurrentView = function() {
        $scope.displayUpdateCurrentView = $scope.currentView && !$scope.currentView.equals(appState.getArea());
    };

    // WATCHERS

    var boundsWatcher = function(newBounds, oldBounds) {
        if (angular.equals(newBounds, oldBounds)) {
            return;
        }
        var newBox = L.latLngBounds($scope.bounds.southWest, $scope.bounds.northEast);
        $scope.currentView = new Area(constants.CURRENT_VIEW_ID, newBox, Area.INTERACTIVE_TYPE);
        updateDisplayUpdateCurrentView();
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
            updateDisplayUpdateCurrentView();
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
