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

    // WATCHERS

    var centerWatcher = function(newCenter, oldCenter) {
        console.log('centerWatcher: ', newCenter);
        if (angular.equals(newCenter, oldCenter)) {
            return;
        }
        var cv = $scope.currentView;
        $scope.currentView = new Area(cv.getName(), L.latLng(newCenter), cv.getBoundingBox());
        appState.setArea($scope.currentView);
    };

    var boundsWatcher = function(newBounds, oldBounds) {
        console.log('boundsWatcher: ', newBounds);
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

    // LISTENERS

    var areaChangedListener = function(event, newArea) {
        var newCenter = newArea.getCenter();
        var newBbox = newArea.getBoundingBox();

        console.log(newArea.getName(), newArea.getCenter(), newArea.getBoundingBox());
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
