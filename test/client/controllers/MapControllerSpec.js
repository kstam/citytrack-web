'use strict';

require('angular');
require('angular-mocks');
var constants = require('client/config/constants');
var config = require('client/config/leafletConfig');
var controllers = require('client/controllers/controllers');
var AppState = require('client/services/AppState');
var Area = require('model/Area');
var NgEventService = require('client/services/NgEventService');
var L = require('leaflet');
var testUtils = require('../../testCommons/testUtils');
var mockedData = require('../../data/poiResponse');
var emptyResponse = require('../../data/emptyPoiResponse');

describe('MapController', function() {
    var scope, controller, appState, eventService;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope, leafletData) {
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        controller = $controller('MapController', {$scope: scope, AppState: appState, NgEventService: eventService,
            leafletData: leafletData});
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
            appState.setArea(testUtils.createRandomArea('Athens'));
            scope.$digest();
            scope.bounds = {southWest: {lat: 10, lng: 11}, northEast: {lat: 15, lng: 16}};
            scope.$digest();

            expect(scope.currentView.getName()).to.equal(constants.CURRENT_VIEW_ID);
        });

        it('should set the new area type to INTERACTIVE', function() {
            appState.setArea(testUtils.createRandomArea('Athens'));
            scope.$digest();
            scope.bounds = {southWest: {lat: 10, lng: 11}, northEast: {lat: 15, lng: 16}};
            scope.$digest();

            expect(scope.currentView.getType()).to.equal(Area.INTERACTIVE_TYPE);
        });

        it('should update the value of "displayUpdateCurrentView"', function() {
            var area = testUtils.createRandomArea(constants.CURRENT_VIEW_ID);
            var bbox = area.getBoundingBox();
            appState.setArea(area);
            scope.$digest();
            scope.bounds = {southWest: {lat: 10, lng: 11}, northEast: {lat: 15, lng: 16}};
            scope.$digest();
            expect(scope.displayUpdateCurrentView).to.be.true();

            scope.bounds = {southWest: {lat: bbox.getSouth(), lng: bbox.getWest()},
                northEast: {lat: bbox.getNorth(), lng: bbox.getEast()}};
            scope.$digest();
            expect(scope.displayUpdateCurrentView).to.be.false();
        });
    });

    describe('exposes applyCurrentView function that', function() {
        it('should update the appState with the current view', function() {
            scope.currentView = testUtils.createRandomArea('Athens');
            scope.applyCurrentView();
            scope.$digest();
            expect(appState.getArea().equals(scope.currentView)).to.equal(true);
        });

        it('should set the displayUpdateCurrentView back to false', function() {
            scope.currentView = testUtils.createRandomArea(constants.CURRENT_VIEW_ID);
            scope.displayUpdateCurrentView = true;
            scope.applyCurrentView();
            scope.$digest();
            expect(scope.displayUpdateCurrentView).to.be.false();
        });
    });

    describe('listens for changes in the AppState and', function() {
        it('should update the currentView and bounds variables', function() {
            appState.setArea(testUtils.createRandomArea('Athens'));
            expect(scope.currentView.equals(appState.getArea())).to.equal(true);

            expect(scope.bounds.southWest.lat).to.equal(scope.currentView.getBoundingBox().getSouth());
            expect(scope.bounds.southWest.lng).to.equal(scope.currentView.getBoundingBox().getWest());
            expect(scope.bounds.northEast.lat).to.equal(scope.currentView.getBoundingBox().getNorth());
            expect(scope.bounds.northEast.lng).to.equal(scope.currentView.getBoundingBox().getEast());
        });
    });

    describe('listens to MAIN_QUERY_SUCCESS event and', function() {
        it('should set the "geojson.data" from the data', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);
            expect(scope.geojson.data).to.equal(mockedData.collection);
        });

        it('should set the bounds of the map in order to zoom into the returned data points', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData);

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
    });
});
