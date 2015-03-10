'use strict';

var angular = require('../shims/angular');
var config = require('../config/leafletConfig');
var Area = require('../../model/Area');
var constants = require('../config/constants');
var L = require('leaflet');
var popupFactory = require('../map/popupFactory');
var markerFactory = require('../map/markerFactory');
var iconFactory = require('../map/iconFactory');

module.exports = function($scope, appState, eventService, leafletData, $compile) {

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
        $scope.featureMap = {};
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

    // GEO-JSON LEAFLET HELPERS
    var addToMap = function(id, key, value) {
        var mapEntry = $scope.featureMap[id] || {};
        mapEntry[key] = value;
        $scope.featureMap[id] = mapEntry;
    };

    var markerClickListenerWithId = function(id) {
        return function() {
            $scope.$applyAsync(function() {
                if ($scope.selectedFeatureId) {
                    $scope.featureMap[$scope.selectedFeatureId].marker.setIcon(iconFactory.defaultMarkerIcon());
                }
                $scope.selectedFeatureId = id;
                $scope.featureMap[id].marker.setIcon(iconFactory.clickedMarkerIcon());
                eventService.broadcastEvent(constants.MAP_FEATURE_SELECTED, id);
            });
        };
    };

    var markerMouseOverListenerWithId = function(id) {
        return function() {
            $scope.$applyAsync(function() {
                resultRowMouseOverListener('', id);
            });
        };
    };

    var markerMouseOutListenerWithId = function(id) {
        return function() {
            $scope.$applyAsync(function() {
                resultRowMouseOutListener('', id);
            });
        };
    };

    var createGeoJSONLayer = function(data) {
        return L.geoJson(data, {
            pointToLayer: function(feature, latlng) {
                var marker = markerFactory.forPoint(feature, latlng);
                marker.on('click', markerClickListenerWithId(feature.id));
                marker.on('mouseover', markerMouseOverListenerWithId(feature.id));
                marker.on('mouseout', markerMouseOutListenerWithId(feature.id));
                addToMap(feature.id, 'marker', marker);
                return marker;
            },
            onEachFeature: function(feature, layer) {
                var popupElement = popupFactory.getPopupElement(feature, $compile, $scope);
                addToMap(feature.id, 'layer', layer);
                $scope.$applyAsync(function() {
                    layer.bindPopup(popupElement[0]);
                });
            }
        });
    };

    var removeLayerFromMap = function(layer, map) {
        if ($scope.geoJsonLayer) {
            map.removeLayer($scope.geoJsonLayer);
        }
    };

    var zoomMapToLayer = function(layer) {
        var bounds = layer.getBounds();
        if (bounds && bounds._northEast && bounds._southWest) {
            setBounds($scope.geoJsonLayer.getBounds());
        }
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
        $scope.selectedFeatureId = undefined;
        // Get the map to add the data
        leafletData.getMap().then(function(map) {
            removeLayerFromMap($scope.geoJsonLayer, map);
            $scope.geoJsonLayer = createGeoJSONLayer(data.collection);
            $scope.geoJsonLayer.addTo(map);
            zoomMapToLayer($scope.geoJsonLayer);
            map.invalidateSize();
        });
    };

    var resultRowSelectedListener = function(event, id) {
        if ($scope.selectedFeatureId) {
            $scope.featureMap[$scope.selectedFeatureId].marker.setIcon(iconFactory.defaultMarkerIcon());
        }
        $scope.selectedFeatureId = id;
        $scope.featureMap[id].marker.openPopup();
        $scope.featureMap[id].marker.setIcon(iconFactory.clickedMarkerIcon());
    };

    var resultRowMouseOverListener = function(event, id) {
        $scope.featureMap[id].marker.setIcon(iconFactory.hoverMarkerIcon());
    };

    var resultRowMouseOutListener = function(event, id) {
        var icon = id === $scope.selectedFeatureId ? iconFactory.clickedMarkerIcon() : iconFactory.defaultMarkerIcon();
        $scope.featureMap[id].marker.setIcon(icon);
    };

    var nextPageSuccessListener = function(event, data) {
        if ($scope.geoJsonLayer) {
            $scope.geoJsonLayer.addData(data.collection);
            zoomMapToLayer($scope.geoJsonLayer);
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
        eventService.on(constants.RESULTS_ROW_SELECTED, resultRowSelectedListener);
        eventService.on(constants.RESULTS_ROW_MOUSE_OVER, resultRowMouseOverListener);
        eventService.on(constants.RESULTS_ROW_MOUSE_OUT, resultRowMouseOutListener);
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
