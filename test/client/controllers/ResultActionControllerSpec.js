'use strict';


require('client/shims/angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var testUtils = require('../../testCommons/testUtils');
var Params = require('model/Params');
var types = require('model/types');
var expect = require('../../testCommons/chaiExpect');
var sinon = require('sinon');
var mockedData = require('../../data/poisForStreetResponse');
var latLng = require('leaflet').latLng;


describe('ResultActionController', function() {
    var scope, appState, eventService, $$controller, searchService;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope) {
        $$controller = $controller;
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        searchService = testUtils.createSearchServiceMock(mockedData);
        initController();
    }));

    describe('sets default state and', function() {
        it('should set "loading" to false', function() {
            expect(scope.loading).to.be.false();
        });
    });

    describe('exposes getPoisForStreet method that', function() {
        it('should do nothing if query is already running', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.loading = true;
            scope.getPoisForStreet(123);
            expect(eventService.broadcastEvent).to.have.callCount(0);
        });

        it('should trigger an event to notify that it started querying', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.getPoisForStreet(123);
            expect(eventService.broadcastEvent).to.have.callCount(2);
            var args = eventService.broadcastEvent.getCall(0).args;
            expect(args[0]).to.equal(constants.MAIN_QUERY_STARTED);
            expect(args[1].streetId).to.deep.equal(123);
        });

        it('should trigger an event to notify that the main query finished successfully and unset "loading"', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.getPoisForStreet(123);
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.MAIN_QUERY_SUCCESS, mockedData);
        });

        it('should trigger an ERROR event if the service call false', function() {
            searchService = testUtils.createSearchServiceMockThatFails();
            initController();
            eventService.broadcastEvent = sinon.spy();
            scope.getPoisForStreet(123);
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.MAIN_QUERY_FAILURE);
        });

        it('should accept string numbers as id and convert them to proper numbers', function() {
            var theParams = {};
            searchService = {};
            searchService.query = function(params) {
                theParams = params;
                return {
                    then: function() {
                    }
                }
            };
            initController();
            scope.getPoisForStreet("123");
            expect(theParams.streetId).to.equal(123);
        });
    });

    describe('exposes getPhotosForStreet method that', function() {
        it('should do nothing if query is already running', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.loading = true;
            scope.getPhotosForStreet(123);
            expect(eventService.broadcastEvent).to.have.callCount(0);
        });

        it('should trigger an event to notify that it started querying', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.getPhotosForStreet(123);
            expect(eventService.broadcastEvent).to.have.callCount(2);
            var args = eventService.broadcastEvent.getCall(0).args;
            expect(args[0]).to.equal(constants.MAIN_QUERY_STARTED);
            expect(args[1].streetId).to.deep.equal(123);
        });

        it('should trigger an event to notify that the main query finished successfully and unset "loading"', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.getPhotosForStreet(123);
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.MAIN_QUERY_SUCCESS, mockedData);
        });

        it('should trigger an ERROR event if the service call false', function() {
            searchService = testUtils.createSearchServiceMockThatFails();
            initController();
            eventService.broadcastEvent = sinon.spy();
            scope.getPhotosForStreet(123);
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.MAIN_QUERY_FAILURE);
        });

        it('should accept string numbers as id and convert them to proper numbers', function() {
            var theParams = {};
            searchService = {};
            searchService.query = function(params) {
                theParams = params;
                return {
                    then: function() {
                    }
                }
            };
            initController();
            scope.getPhotosForStreet("123");
            expect(theParams.streetId).to.equal(123);
        });
    });

    describe('exposes getRelatedPhotosAroundFeature method that', function() {
        it('should do nothing if query is already running', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.loading = true;
            scope.getRelatedPhotosAroundFeature(mockedData.collection.features[0], 0.150);
            expect(eventService.broadcastEvent).to.have.callCount(0);
        });

        it('should trigger an event to notify that it started querying', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.getRelatedPhotosAroundFeature(mockedData.collection.features[0], 0.150);
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.PERFORM_SEARCH_NO_RESET_EVT);
            expect(appState.getKeyword()).to.equal(mockedData.collection.features[0].properties.label);
            expect(appState.getType()).to.equal(types.photo);
            var usedArea = appState.getArea();
            expect(usedArea.getName()).to.equal(mockedData.collection.features[0].properties.label);
            expect(usedArea.getRadius()).to.equal(0.150);
            expect(usedArea.getCenter().equals(latLng(mockedData.collection.features[0].geometry.coordinates)));
        });
    });

    describe('exposes getRelatedPoisAroundFeature method that', function() {
        it('should do nothing if query is already running', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.loading = true;
            scope.getRelatedPoisAroundFeature(mockedData.collection.features[0], 0.150);
            expect(eventService.broadcastEvent).to.have.callCount(0);
        });

        it('should trigger an event to notify that it started querying', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.getRelatedPoisAroundFeature(mockedData.collection.features[0], 0.150);
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.PERFORM_SEARCH_NO_RESET_EVT);
            expect(appState.getKeyword()).to.equal(mockedData.collection.features[0].properties.label);
            expect(appState.getType()).to.equal(types.poi);
            var usedArea = appState.getArea();
            expect(usedArea.getName()).to.equal(mockedData.collection.features[0].properties.label);
            expect(usedArea.getRadius()).to.equal(0.150);
            expect(usedArea.getCenter().equals(latLng(mockedData.collection.features[0].geometry.coordinates)));
        });
    });

    describe('exposes getRelatedEventsAroundFeature method that', function() {
        it('should do nothing if query is already running', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.loading = true;
            scope.getRelatedEventsAroundFeature(mockedData.collection.features[0], 0.150);
            expect(eventService.broadcastEvent).to.have.callCount(0);
        });

        it('should trigger an event to notify that it started querying', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.getRelatedEventsAroundFeature(mockedData.collection.features[0], 0.150);
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.PERFORM_SEARCH_NO_RESET_EVT);
            expect(appState.getKeyword()).to.equal(mockedData.collection.features[0].properties.label);
            expect(appState.getType()).to.equal(types.event);
            var usedArea = appState.getArea();
            expect(usedArea.getName()).to.equal(mockedData.collection.features[0].properties.label);
            expect(usedArea.getRadius()).to.equal(0.150);
            expect(usedArea.getCenter().equals(latLng(mockedData.collection.features[0].geometry.coordinates)));
        });
    });

    describe('listens to MAIN_QUERY_STARTED event and', function() {
        it('should set the loading to true', function() {
            expect(scope.loading).to.be.false();
            eventService.broadcastEvent(constants.MAIN_QUERY_STARTED, appState.getParams());
            expect(scope.loading).to.be.true();
        });
    });

    describe('listens to MAIN_QUERY_SUCCESS and MAIN_QUERY_ERROR events and', function() {
        it('should set the loading back to false', function() {
            scope.loading = true;
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS);
            expect(scope.loading).to.be.false();

            scope.loading = true;
            eventService.broadcastEvent(constants.MAIN_QUERY_FAILURE);
            expect(scope.loading).to.be.false();
        });
    });

    function initController() {
        $$controller('ResultActionController',
            {$scope: scope, AppState: appState, NgEventService: eventService, SearchService: searchService});
    }
});
