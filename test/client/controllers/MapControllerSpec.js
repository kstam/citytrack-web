'use strict';

require('client/shims/angular');
require('angular-mocks');
var constants = require('client/config/constants');
var config = require('client/config/leafletConfig');
var controllers = require('client/controllers/controllers');
var AppState = require('client/services/AppState');
var iconFactory = require('client/map/iconFactory');
var Area = require('model/Area');
var NgEventService = require('client/services/NgEventService');
var L = require('leaflet');
var testUtils = require('../../testCommons/testUtils');
var mockedData = require('../../data/poiResponse');
var mockedData2 = require('../../data/poiResponse2');
var emptyResponse = require('../../data/emptyPoiResponse');
var streetResponse = require('../../data/streetOfInterestResponse');
var expect = require('../../testCommons/chaiExpect');
var sinon = require('sinon');

describe('MapController', function() {
    var scope, $controller, appState, eventService, $rootScope, leafletData,
        mockedMap, $compile;

    beforeEach(angular.mock.module('templates/resultRow.html'));

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(angular.mock.module('ng'));

    beforeEach(inject(function(_$controller_, _$rootScope_, $q, _leafletData_, _$compile_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        mockedMap = testUtils.getMockMap();
        leafletData = _leafletData_;
        $compile = _$compile_;
        sinon.stub(leafletData, 'getMap').returns($q.when(mockedMap));
        initController();
    }));

    describe('configures an initial state and', function() {
        it('should set the center to (0,0,1)', function() {
            expect(scope.center.lng).to.equal(0);
            expect(scope.center.lat).to.equal(0);
            expect(scope.center.zoom).to.equal(1);
        });

        it('should define the bounds object', function() {
            expect(scope.bounds).not.to.equal(undefined);
        });

        it('should define the tiles object', function() {
            expect(scope.tiles.url).not.to.equal(undefined);
            expect(scope.tiles.options).not.to.equal(undefined);
        });

        it('should define the maxbounds object', function() {
            expect(scope.maxbounds).not.to.equal(undefined);
        });
        it('should define the displayUpdateCurrentView to false', function() {
            expect(scope.displayUpdateCurrentView).to.be.false();
        });

        it('should define the initial view based on the default values', function() {
            expect(scope.currentView).not.to.equal(undefined);
            expect(scope.currentView.getName()).to.equal(constants.CURRENT_VIEW_ID);
            expect(scope.currentView.getBoundingBox()
                .equals(L.latLngBounds(config.maxbounds.southWest, config.maxbounds.northEast))).to.equal(true);
            expect(scope.currentView.getType()).to.equal(Area.INTERACTIVE_TYPE);
        });

        it('should initialize a "featureMap" as an empty object', function() {
            expect(scope.featureMap).to.deep.equal({});
        });
    });

    describe('listens for changes in bounds and', function() {
        it('should update the bounding box', function() {
            scope.$digest();
            scope.bounds = {southWest: {lat: 10, lng: 11}, northEast: {lat: 15, lng: 16}};
            scope.$digest();

            expect(scope.currentView.getBoundingBox().getEast()).to.equal(scope.bounds.northEast.lng);
            expect(scope.currentView.getBoundingBox().getNorth()).to.equal(scope.bounds.northEast.lat);
            expect(scope.currentView.getBoundingBox().getWest()).to.equal(scope.bounds.southWest.lng);
            expect(scope.currentView.getBoundingBox().getSouth()).to.equal(scope.bounds.southWest.lat);
        });

        it('should update the name back to current view', function() {
            appState.setArea(testUtils.createRandomBoxArea('Athens'));
            scope.$digest();
            scope.bounds = {southWest: {lat: 10, lng: 11}, northEast: {lat: 15, lng: 16}};
            scope.$digest();

            expect(scope.currentView.getName()).to.equal(constants.CURRENT_VIEW_ID);
        });

        it('should set the new area type to INTERACTIVE', function() {
            appState.setArea(testUtils.createRandomBoxArea('Athens'));
            scope.$digest();
            scope.bounds = {southWest: {lat: 10, lng: 11}, northEast: {lat: 15, lng: 16}};
            scope.$digest();

            expect(scope.currentView.getType()).to.equal(Area.INTERACTIVE_TYPE);
        });

        it('should update the value of "displayUpdateCurrentView"', function() {
            var area = testUtils.createRandomBoxArea(constants.CURRENT_VIEW_ID);
            var bbox = area.getBoundingBox();
            appState.setArea(area);
            scope.$digest();
            scope.bounds = {southWest: {lat: 10, lng: 11}, northEast: {lat: 15, lng: 16}};
            scope.$digest();
            expect(scope.displayUpdateCurrentView).to.be.true();

            scope.bounds = {
                southWest: {lat: bbox.getSouth(), lng: bbox.getWest()},
                northEast: {lat: bbox.getNorth(), lng: bbox.getEast()}
            };
            scope.$digest();
            expect(scope.displayUpdateCurrentView).to.be.false();
        });
    });

    describe('exposes applyCurrentView function that', function() {
        it('should update the appState with the current view', function() {
            scope.currentView = testUtils.createRandomBoxArea('Athens');
            scope.applyCurrentView();
            scope.$digest();
            expect(appState.getArea().equals(scope.currentView)).to.equal(true);
        });

        it('should set the displayUpdateCurrentView back to false', function() {
            scope.currentView = testUtils.createRandomBoxArea(constants.CURRENT_VIEW_ID);
            scope.displayUpdateCurrentView = true;
            scope.applyCurrentView();
            scope.$digest();
            expect(scope.displayUpdateCurrentView).to.be.false();
        });
        it('should fire a MAP_VIEW_CHANGED event', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.currentView = testUtils.createRandomBoxArea(constants.CURRENT_VIEW_ID);
            scope.applyCurrentView();
            scope.$digest();
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.MAP_VIEW_CHANGED);
        });
    });

    describe('listens for changes in the AppState and', function() {
        it('should update the currentView and bounds variables', function() {
            appState.setArea(testUtils.createRandomBoxArea('Athens'));
            expect(scope.currentView.equals(appState.getArea())).to.equal(true);
            $rootScope.$digest();

            expect(scope.bounds.southWest.lat).to.equal(scope.currentView.getBoundingBox().getSouth());
            expect(scope.bounds.southWest.lng).to.equal(scope.currentView.getBoundingBox().getWest());
            expect(scope.bounds.northEast.lat).to.equal(scope.currentView.getBoundingBox().getNorth());
            expect(scope.bounds.northEast.lng).to.equal(scope.currentView.getBoundingBox().getEast());
        });
    });

    describe('listens to MAIN_QUERY_SUCCESS event and', function() {
        it('should pass the GeoJson to the map', function() {
            mockedMap.addLayer = sinon.spy();
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);
            $rootScope.$digest();

            var addedLayer = mockedMap.addLayer.getCall(0).args[0];
            expect(addedLayer).to.equal(scope.geoJsonLayer);
        });

        it('should set the bounds of the map in order to zoom into the returned data points', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);
            $rootScope.$digest(); // resolves promise
            $rootScope.$digest(); // resolves applyAsync
            var box = L.geoJson(mockedData.collection).getBounds();
            expect(scope.bounds.southWest.lat).to.equal(box.getSouth());
            expect(scope.bounds.southWest.lng).to.equal(box.getWest());
            expect(scope.bounds.northEast.lat).to.equal(box.getNorth());
            expect(scope.bounds.northEast.lng).to.equal(box.getEast());
        });

        it('should not attempt to set the bounds when response is empty', function() {
            expect(function() {
                eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, emptyResponse);
            }).not.to.throw(Error);
        });

        it('should add all the markers to the feature map hashed on their "id"', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);
            $rootScope.$digest(); // resolves getMap() promise

            mockedData.collection.features.forEach(function(feature) {
                expect(scope.featureMap[feature.id]).not.to.be.undefined();
            });
        });

        it('should set the "selectedFeatureId" back to undefined', function() {
            scope.selectedFeatureId = 'asdasd';
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);
            $rootScope.$digest(); // resolves getMap() promise
            expect(scope.selectedFeatureId).to.be.undefined();
        });
    });

    describe('listens to FETCH_NEXT_PAGE_SUCCESS and', function() {
        it('should add the new data to the map', function() {
            scope.geoJsonLayer = L.geoJson(mockedData.collection);
            scope.geoJsonLayer.addData = sinon.spy();
            eventService.broadcastEvent(constants.FETCH_NEXT_PAGE_SUCCESS, mockedData2);
            $rootScope.$digest();
            expect(scope.geoJsonLayer.addData).to.have.been.calledWith(mockedData2.collection);
        });
    });

    describe('listens to RESULTS_ROW_MOUSE_OVER and RESULTS_ROW_MOUSE_OUT evenst and', function() {
        it('should change the marker icon to the hover version when a marker is hovered', function() {
            var hoveredMarkerId =  mockedData.collection.features[0].id;
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);
            $rootScope.$digest(); // resolves getMap() promise

            eventService.broadcastEvent(constants.RESULTS_ROW_MOUSE_OVER, hoveredMarkerId);
            expect(scope.featureMap[hoveredMarkerId].marker.options.icon).to.equal(iconFactory.hoverMarkerIcon());
        });

        it('should change the marker icon back to the default one on MOUSE_OUT', function() {
            var hoveredMarkerId =  mockedData.collection.features[0].id;
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);
            $rootScope.$digest(); // resolves getMap() promise

            eventService.broadcastEvent(constants.RESULTS_ROW_MOUSE_OVER, hoveredMarkerId);
            eventService.broadcastEvent(constants.RESULTS_ROW_MOUSE_OUT, hoveredMarkerId);
            expect(scope.featureMap[hoveredMarkerId].marker.options.icon).to.equal(iconFactory.defaultMarkerIcon());
        });

        it('should change the marker icon back to the clickedMarkerIcon on MOUSE_OUT if marker is selected', function() {
            var hoveredMarkerId =  mockedData.collection.features[0].id;
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);
            $rootScope.$digest(); // resolves getMap() promise
            scope.selectedFeatureId = hoveredMarkerId;

            eventService.broadcastEvent(constants.RESULTS_ROW_MOUSE_OVER, hoveredMarkerId);
            eventService.broadcastEvent(constants.RESULTS_ROW_MOUSE_OUT, hoveredMarkerId);
            expect(scope.featureMap[hoveredMarkerId].marker.options.icon).to.equal(iconFactory.clickedMarkerIcon());
        });

        it('should properly handle when data is not markers', function() {
            var hoveredMarkerId =  streetResponse.collection.features[0].id;
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, streetResponse);
            $rootScope.$digest(); // resolves getMap() promise
            scope.featureMap[hoveredMarkerId].layer.setStyle = sinon.spy();
            expect(scope.featureMap[hoveredMarkerId].marker).to.be.undefined();

            scope.selectedFeatureId = hoveredMarkerId;

            eventService.broadcastEvent(constants.RESULTS_ROW_MOUSE_OVER, hoveredMarkerId);
            eventService.broadcastEvent(constants.RESULTS_ROW_MOUSE_OUT, hoveredMarkerId);
            expect(scope.featureMap[hoveredMarkerId].layer.setStyle).to.have.callCount(2);
        });
    });

    describe('listens to RESULTS_ROW_SELECTED and', function() {
        it('should open the popup for the marker of the feature that was selected', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);
            $rootScope.$digest(); // resolves getMap() promise

            var selectedFeatureId =  mockedData.collection.features[1].id;
            scope.featureMap[selectedFeatureId].marker.openPopup = sinon.spy();
            eventService.broadcastEvent(constants.RESULTS_ROW_SELECTED, selectedFeatureId);

            expect(scope.selectedFeatureId).to.equal(selectedFeatureId);
            expect(scope.featureMap[selectedFeatureId].marker.options.icon).to.equal(iconFactory.clickedMarkerIcon());
            expect(scope.featureMap[selectedFeatureId].marker.openPopup).to.have.callCount(1);
        });

        it('should update the icon to the clicked icon', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);
            $rootScope.$digest(); // resolves getMap() promise

            var selectedFeatureId =  mockedData.collection.features[1].id;
            eventService.broadcastEvent(constants.RESULTS_ROW_SELECTED, selectedFeatureId);

            expect(scope.featureMap[selectedFeatureId].marker.options.icon).to.equal(iconFactory.clickedMarkerIcon());
        });


        it('should update the icon to the previously selected marker back to the default clicked icon', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);
            $rootScope.$digest(); // resolves getMap() promise

            var selectedFeatureId1 =  mockedData.collection.features[1].id;
            var selectedFeatureId2 =  mockedData.collection.features[2].id;
            eventService.broadcastEvent(constants.RESULTS_ROW_SELECTED, selectedFeatureId1);
            $rootScope.$digest();
            eventService.broadcastEvent(constants.RESULTS_ROW_SELECTED, selectedFeatureId2);
            $rootScope.$digest();

            expect(scope.featureMap[selectedFeatureId1].marker.options.icon).to.equal(iconFactory.defaultMarkerIcon());
            expect(scope.featureMap[selectedFeatureId2].marker.options.icon).to.equal(iconFactory.clickedMarkerIcon());
        });
    });

    describe('listens to "click" marker events and', function() {
        //TODO: test map originated events
        it('should trigger a MAP_FEATURE_SELECTED event', function() {
            //var selectedFeatureId =  mockedData.collection.features[1].id;
            //eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);
            //$rootScope.$digest(); // resolves getMap() promise
            //$rootScope.$digest(); // resolves applyAsync
            //
            //eventService.broadcastEvent = sinon.spy();
            //scope.featureMap[selectedFeatureId].marker.fire('click');
            //scope.$digest(); // resolves $applyAsync
            //expect(scope.selectedFeatureId).to.equal(selectedFeatureId);
            //expect(eventService.broadcastEvent).to.have.been.calledWith(constants.MAP_FEATURE_SELECTED, selectedFeatureId);
        });
    });

    // HELPER FUNCTIONS
    function initController() {
        $controller('MapController', {
            $scope: scope, AppState: appState, NgEventService: eventService,
            leafletData: leafletData, $compile: $compile
        });
    }
});
