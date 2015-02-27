'use strict';

var angular = require('../shims/angular');
var config = require('../config/leafletConfig');
var Area = require('../../model/Area');
var constants = require('../config/constants');
var L = require('leaflet');

module.exports = function($scope, appState, eventService) {

    var initCurrentView = function() {
        var center = L.latLng(config.center);
        var bounds = L.latLngBounds(config.maxbounds.southWest, config.maxbounds.northEast);
        $scope.currentView = new Area(constants.CURRENT_VIEW_ID, center, bounds);
        appState.setArea($scope.currentView);
    };

    var setDefaults = function() {
        angular.extend($scope, config);
    };

    var centerWatcher = function(newCenter, oldCenter) {
        if (angular.equals(newCenter, oldCenter)) {
            return;
        }
        var cv = $scope.currentView;
        $scope.currentView = new Area(cv.getName(), L.latLng(newCenter), cv.getBoundingBox());
        appState.setArea($scope.currentView);
    };

    var boundsWatcher = function(newBounds, oldBounds) {
        if (angular.equals(newBounds, oldBounds)) {
            return;
        }
        var cv = $scope.currentView;
        var newBbox = L.latLngBounds($scope.bounds.southWest, $scope.bounds.northEast);
        $scope.currentView = new Area(cv.getName(), cv.getCenter(), newBbox);
        appState.setArea($scope.currentView);
    };

    var initWatchers = function() {
        $scope.$watch('center', centerWatcher, true);
        $scope.$watch('bounds', boundsWatcher, true);
    };

    var initEventListeners = function() {
        eventService.on(appState.AREA_CHANGED_EVT, function(event, newArea) {
            var newCenter = newArea.getCenter();
            var newBbox = newArea.getBoundingBox();

            $scope.currentView = newArea;

            angular.extend($scope.center, {
                lat: newCenter.lat,
                lng: newCenter.lng
            });

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
        });
    };

    var initialize = function() {
        setDefaults();
        initCurrentView();
        initWatchers();
        initEventListeners();
    };

    initialize();
};
