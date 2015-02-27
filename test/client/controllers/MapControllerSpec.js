'use strict';

require('angular');
require('angular-mocks');
var constants = require('client/config/constants');
var config = require('client/config/leafletConfig');
var controllers = require('client/controllers/controllers');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var L = require('leaflet');
var testUtils = require('../../testCommons/testUtils');

describe('MapController', function() {
    var scope, controller, appState, eventService;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        controller = $controller('MapController', {$scope: scope, AppState: appState, NgEventService: eventService});
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

        it('should define the initial view based on the default values', function() {
            expect(scope.currentView).not.to.equal(undefined);
            expect(scope.currentView.getName()).to.equal(constants.CURRENT_VIEW_ID);
            expect(scope.currentView.getBoundingBox()
                .equals(L.latLngBounds(config.maxbounds.southWest, config.maxbounds.northEast))).to.equal(true);
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

        it('should update the appState with the new current view', function() {
            scope.$digest();
            expect(appState.getArea().equals(scope.currentView)).to.equal(true);

            scope.bounds = {southWest: {lat: 10, lng: 11}, northEast: {lat: 15, lng: 16}};
            scope.$digest();
            expect(appState.getArea().equals(scope.currentView)).to.equal(true);
        });
    });

    describe('listens for changes in the AppState and', function() {
        it('should update the currentView and bounds variables', function() {
            scope.$digest();
            appState.setArea(testUtils.createRandomArea('Athens'));
            scope.$digest();

            expect(scope.currentView.equals(appState.getArea())).to.equal(true);

            expect(scope.bounds.southWest.lat).to.equal(scope.currentView.getBoundingBox().getSouth());
            expect(scope.bounds.southWest.lng).to.equal(scope.currentView.getBoundingBox().getWest());
            expect(scope.bounds.northEast.lat).to.equal(scope.currentView.getBoundingBox().getNorth());
            expect(scope.bounds.northEast.lng).to.equal(scope.currentView.getBoundingBox().getEast());
        });
    });
});
