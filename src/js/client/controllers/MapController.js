'use strict';

var angular = require('../shims/angular');
var config = require('../config/leafletConfig');
var Area = require('../../model/Area');
var AreaBox = require('../../model/AreaBox');
var AreaCircle = require('../../model/AreaCircle');
var constants = require('../config/constants');
var L = require('leaflet');
var popupFactory = require('../map/popupFactory');
var markerFactory = require('../map/markerFactory');
var iconFactory = require('../map/iconFactory');
var styleFactory = require('../map/styleFactory');
var types = require('../../model/types');
var utils = require('../../common/utils');

module.exports = function($scope, appState, eventService, leafletData, $compile) {

    $scope.applyCurrentView = function() {
        appState.setArea($scope.currentView);
        eventService.broadcastEvent(constants.MAP_VIEW_CHANGED);
        $scope.displayUpdateCurrentView = false;
    };

    var initCurrentView = function() {
        var bounds = L.latLngBounds(config.maxbounds.southWest, config.maxbounds.northEast);
        $scope.displayUpdateCurrentView = false;
        $scope.currentView = new AreaBox(constants.CURRENT_VIEW_ID, bounds, Area.INTERACTIVE_TYPE);
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
            resultRowSelectedListener('', id, true);
            $scope.$applyAsync(function() {
                $scope.selectedFeatureId = id;
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
                addToMap(feature.id, 'marker', marker);
                return marker;
            },
            onEachFeature: function(feature, layer) {
                var popupElement = popupFactory.getPopupElement(feature, $compile, $scope);
                addToMap(feature.id, 'feature', feature);
                addToMap(feature.id, 'layer', layer);
                $scope.$applyAsync(function() {
                    layer.bindPopup(popupElement[0]);
                });
                layer.on('click', markerClickListenerWithId(feature.id));
                layer.on('mouseover', markerMouseOverListenerWithId(feature.id));
                layer.on('mouseout', markerMouseOutListenerWithId(feature.id));
                if (utils.isFunction(layer.setStyle)) {
                    layer.setStyle(styleFactory.getDefaultStyleForFeature());
                }
                layer.on('remove', function() {
                    popupElement.destroy();
                });
            }
        });
    };

    var removeLayerFromMap = function(layer, map) {
        if (layer) {
            map.removeLayer(layer);
        }
    };

    var zoomMapToLayer = function(layer) {
        var bounds = layer.getBounds();
        if (bounds && bounds._northEast && bounds._southWest) {
            setBounds($scope.geoJsonLayer.getBounds());
        }
    };

    var createAreaLayer = function(area, map) {
        removeLayerFromMap($scope.areaLayer, map);
        if (area instanceof AreaBox) {
            $scope.areaLayer = L.rectangle(area.getBoundingBox());
        } else if (area instanceof AreaCircle) {
            $scope.areaLayer = L.circle(area.getCenter(), area.getRadius() * 1000);
        }
        $scope.areaLayer.addTo(map);
    };

    // MAP EVENTS
    var openContextMenu = function(map, point) {
        var popupElement = popupFactory.getContextPopup(point, $compile, $scope);
        $scope.$applyAsync(function() {
            var popupOptions = {
                closeButton: false,
                className: 'context-popup-container'
            };
            var popup = L.popup(popupOptions)
                .setContent(popupElement[0])
                .setLatLng(point)
                .openOn(map);
        });
    };

    var registerMapEvents = function() {
        $scope.$applyAsync(function() {
            leafletData.getMap().then(function(map) {
                // CONTEXT MENU
                map.on('contextmenu', function(event) {
                    openContextMenu(map, event.latlng);
                });
            });
        });
    };

    // WATCHERS

    var boundsWatcher = function(newBounds, oldBounds) {
        if (angular.equals(newBounds, oldBounds)) {
            return;
        }
        var newBox = L.latLngBounds($scope.bounds.southWest, $scope.bounds.northEast);
        $scope.currentView = new AreaBox(constants.CURRENT_VIEW_ID, newBox, Area.INTERACTIVE_TYPE);
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
            removeLayerFromMap($scope.areaLayer, map);
            $scope.geoJsonLayer = createGeoJSONLayer(data.collection);
            $scope.geoJsonLayer.addTo(map);
            zoomMapToLayer($scope.geoJsonLayer);
            map.invalidateSize();
        });
    };

    var resultRowSelectedListener = function(event, id, fromClick) {
        var oldFeatureEntry = ($scope.selectedFeatureId) ? $scope.featureMap[$scope.selectedFeatureId] : undefined;
        var featureEntry = $scope.featureMap[id];

        $scope.selectedFeatureId = id;
        if (featureEntry.marker) { //isA marker
            if (oldFeatureEntry) {
                oldFeatureEntry.marker.setIcon(iconFactory.defaultMarkerIcon());
            }
            if (!fromClick) {
                featureEntry.marker.openPopup();
            }
            featureEntry.marker.setIcon(iconFactory.clickedMarkerIcon());
        } else if (
            featureEntry.feature.properties.type === types.streetofinterest.id ||
            featureEntry.feature.properties.type === types.regionofinterest.id
        ) { //isA line or region
            if (oldFeatureEntry) {
                oldFeatureEntry.layer.setStyle(styleFactory.getDefaultStyleForFeature());
            }
            featureEntry.layer.setStyle(styleFactory.getClickedStyleForFeature());
            featureEntry.layer.openPopup();
        }
    };

    var resultRowMouseOverListener = function(event, id) {
        var featureEntry = $scope.featureMap[id];
        if (featureEntry.marker) { //isA marker
            featureEntry.marker.setIcon(iconFactory.hoverMarkerIcon());
        } else if (
            featureEntry.feature.properties.type === types.streetofinterest.id ||
            featureEntry.feature.properties.type === types.regionofinterest.id
        ) { //isA line or region
            featureEntry.layer.setStyle(styleFactory.getHoverStyleForFeature());
            featureEntry.layer.redraw();
        }
    };

    var resultRowMouseOutListener = function(event, id) {
        var featureEntry = $scope.featureMap[id];
        if (featureEntry.marker) { //isA marker
            var icon = id === $scope.selectedFeatureId ? iconFactory.clickedMarkerIcon() : iconFactory.defaultMarkerIcon();
            featureEntry.marker.setIcon(icon);
        } else if (
            featureEntry.feature.properties.type === types.streetofinterest.id ||
            featureEntry.feature.properties.type === types.regionofinterest.id
        ) { //isA line or region
            var style = id === $scope.selectedFeatureId ? styleFactory.getClickedStyleForFeature() :
                styleFactory.getDefaultStyleForFeature();
            featureEntry.layer.setStyle(style);
            featureEntry.layer.redraw();
        }
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

            $scope.$applyAsync(function() {
                leafletData.getMap().then(function(map) {
                    createAreaLayer(newArea, map);
                });
            });
        }
    };

    var contextCloseEventListener = function() {
        $scope.$applyAsync(function() {
            leafletData.getMap().then(function(map) {
                map.closePopup();
            });
        });
    };

    var initEventListeners = function() {
        eventService.on(appState.AREA_CHANGED_EVT, areaChangedListener);
        eventService.on(constants.MAIN_QUERY_SUCCESS, mainQuerySuccessListener);
        eventService.on(constants.FETCH_NEXT_PAGE_SUCCESS, nextPageSuccessListener);
        eventService.on(constants.RESULTS_ROW_SELECTED, resultRowSelectedListener);
        eventService.on(constants.RESULTS_ROW_MOUSE_OVER, resultRowMouseOverListener);
        eventService.on(constants.RESULTS_ROW_MOUSE_OUT, resultRowMouseOutListener);
        eventService.on(constants.MAP_CONTEXT_CLOSE_EVT, contextCloseEventListener);
    };

    var initialize = function() {
        setDefaults();
        initCurrentView();
        initWatchers();
        initEventListeners();
        fixMapSize();
        registerMapEvents();
    };

    initialize();
};
