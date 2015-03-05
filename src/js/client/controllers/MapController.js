'use strict';

var angular = require('../shims/angular');
var config = require('../config/leafletConfig');
var Area = require('../../model/Area');
var constants = require('../config/constants');
var L = require('leaflet');
var popupFactory = require('../map/popupFactory');

module.exports = function($scope, appState, eventService, leafletData) {

    $scope.applyCurrentView = function() {
        appState.setArea($scope.currentView);
        eventService.broadcastEvent(constants.MAP_VIEW_CHANGED);
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

    var fixMapSize = function() {
        $scope.$applyAsync(function() {
            leafletData.getMap().then(function(map) {
                map.invalidateSize();
            });
        });
    };

    var setBounds = function(latLngBounds) {
        $scope.$applyAsync(function() {
            angular.extend($scope.bounds, {
                northEast: {
                    lat: latLngBounds.getNorth(),
                    lng: latLngBounds.getEast()
                },
                southWest: {
                    lat: latLngBounds.getSouth(),
                    lng: latLngBounds.getWest()
                }
            });
        });
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

    var mainQuerySuccessListener = function(event, data) {
        var geojsonMarkerOptions = {};

        // Get the map to add the data
        leafletData.getMap().then(function(map) {
            if ($scope.geoJsonLayer) {
                    map.removeLayer($scope.geoJsonLayer);
            }
            $scope.geoJsonLayer = L.geoJson(data.collection, {
                pointToLayer: function(feature, latlng) {
                    return L.marker(latlng, geojsonMarkerOptions);
                },
                onEachFeature: function(feature, layer) {
                    layer.bindPopup(popupFactory.getPopupHtml(feature));
                }
            });
            $scope.geoJsonLayer.addTo(map);

            // fix the bounds to zoom to selection
            if (data.collection.features.length > 0) {
                setBounds($scope.geoJsonLayer.getBounds());
            }
        });

        fixMapSize();
    };

    var nextPageSuccessListener = function(event, data) {
        if ($scope.geoJsonLayer) {
            $scope.geoJsonLayer.addData(data.collection);
            if (data.collection.features.length > 0) {
                setBounds($scope.geoJsonLayer.getBounds());
            }
        }
    };

    var areaChangedListener = function(event, newArea) {
        if (newArea && (!newArea.equals($scope.currentView))) {
            var newBbox = newArea.getBoundingBox();

            $scope.currentView = newArea;

            setBounds(newBbox);
            updateDisplayUpdateCurrentView();
        }
    };

    var initEventListeners = function() {
        eventService.on(appState.AREA_CHANGED_EVT, areaChangedListener);
        eventService.on(constants.MAIN_QUERY_SUCCESS, mainQuerySuccessListener);
        eventService.on(constants.FETCH_NEXT_PAGE_SUCCESS, nextPageSuccessListener);
    };

    var initialize = function() {
        setDefaults();
        initCurrentView();
        initWatchers();
        initEventListeners();
        fixMapSize();
    };

    initialize();
};
