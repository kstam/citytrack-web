'use strict';

var angular = require('../shims/angular');
var constants = require('../config/constants');
var fields = require('../../model/fields');
var types = require('../../model/types');
var ParamsBuilder = require('../../model/Params').Builder;
var AreaCircle = require('../../model/AreaCircle');
var AreaPolygon = require('../../model/AreaPolygon');
var Area = require('../../model/Area');
var latLng = require('leaflet').latLng;

module.exports = function($scope, appState, eventService, searchService) {

    var extractLatLng = function(feature) {
        return latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
    };

    var extractPolygon = function(feature) {
        var points = feature.geometry.coordinates[0];
        var result = [];
        console.log(points);
        points.forEach(function(point) {
            result.push(latLng(point[1], point[0]));
        });
        return result;
    };

    $scope.getPoisForStreet = function(streetId) {
        if ($scope.loading === true) {
            return;
        }
        var params = new ParamsBuilder()
            .withType(types.poisforstreet)
            .withStreetId(Number(streetId))
            .withCategories(appState.getCategories())
            .build();
        eventService.broadcastEvent(constants.MAIN_QUERY_STARTED, params);
        searchService.query(params).then(
            function(data) {
                eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, data);
            }, function() {
                eventService.broadcastEvent(constants.MAIN_QUERY_FAILURE);
            }
        );
    };

    $scope.getPhotosForStreet = function(streetId) {
        if ($scope.loading === true) {
            return;
        }
        var params = new ParamsBuilder()
            .withType(types.photosforstreet)
            .withStreetId(Number(streetId))
            .build();
        eventService.broadcastEvent(constants.MAIN_QUERY_STARTED, params);
        searchService.query(params).then(
            function(data) {
                eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, data);
            }, function() {
                eventService.broadcastEvent(constants.MAIN_QUERY_FAILURE);
            }
        );
    };

    $scope.getPoisForRegion = function(feature) {
        if ($scope.loading === true) {
            return;
        }
        appState.setType(types.poi);
        appState.setKeyword('*');
        appState.setArea(new AreaPolygon(feature.properties.label, extractPolygon(feature), Area.INTERACTIVE_TYPE));
        appState.setCategories(appState.getCategories());
        eventService.broadcastEvent(constants.PERFORM_SEARCH_NO_RESET_EVT);
    };

    $scope.getPhotosForRegion = function(feature) {
        if ($scope.loading === true) {
            return;
        }
        appState.setType(types.photo);
        appState.setKeyword('*');
        appState.setArea(new AreaPolygon(feature.properties.label, extractPolygon(feature), Area.INTERACTIVE_TYPE));
        appState.setCategories(appState.getCategories());
        eventService.broadcastEvent(constants.PERFORM_SEARCH_NO_RESET_EVT);
    };

    $scope.getRelatedPhotosAroundFeature = function(feature, radius) {
        if ($scope.loading === true) {
            return;
        }
        appState.setType(types.photo);
        appState.setKeyword(feature.properties.label);
        appState.setArea(new AreaCircle(feature.properties.label, extractLatLng(feature), radius, Area.INTERACTIVE_TYPE));
        eventService.broadcastEvent(constants.PERFORM_SEARCH_NO_RESET_EVT);
    };

    $scope.getRelatedPoisAroundFeature = function(feature, radius) {
        if ($scope.loading === true) {
            return;
        }
        appState.setType(types.poi);
        appState.setKeyword(feature.properties.label);
        appState.setArea(new AreaCircle(feature.properties.label, extractLatLng(feature), radius, Area.INTERACTIVE_TYPE));
        eventService.broadcastEvent(constants.PERFORM_SEARCH_NO_RESET_EVT);
    };

    $scope.getRelatedEventsAroundFeature = function(feature, radius) {
        if ($scope.loading === true) {
            return;
        }
        appState.setType(types.event);
        appState.setKeyword(feature.properties.label);
        appState.setArea(new AreaCircle(feature.properties.label, extractLatLng(feature), radius, Area.INTERACTIVE_TYPE));
        eventService.broadcastEvent(constants.PERFORM_SEARCH_NO_RESET_EVT);
    };

    // LISTENERS
    var mainQueryStartedListener = function() {
        $scope.loading = true;
    };

    var mainQueryFinishedListener = function() {
        $scope.loading = false;
    };

    var initListeners = function() {
        eventService.on(constants.MAIN_QUERY_STARTED, mainQueryStartedListener);
        eventService.on(constants.MAIN_QUERY_FAILURE, mainQueryFinishedListener);
        eventService.on(constants.MAIN_QUERY_SUCCESS, mainQueryFinishedListener);
    };

    // INITIALIZER
    var setDefaults = function() {
        $scope.loading = false;
    };

    var initialize = function() {
        setDefaults();
        initListeners();
    };

    initialize();
};
