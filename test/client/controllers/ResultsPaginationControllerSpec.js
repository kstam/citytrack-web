'use strict';

require('client/shims/angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var types = require('model/types');
var testUtils = require('../../testCommons/testUtils');
var mockedData = require('../../data/poiResponse2');
var emptyResponse = require('../../data/emptyPoiResponse');
var sinon = require('sinon');
var expect = require('../../testCommons/chaiExpect');

describe('ResultsPaginationController', function() {
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

    describe('initializes the scope and', function() {
        it('should set the "queryRunning" property to false', function() {
            expect(scope.queryRunning).to.be.false();
        });
        it('should set the "reachedTheEnd" property to false', function() {
            expect(scope.reachedTheEnd).to.be.false();
        });
    });

    describe('listens to MAIN_QUERY_STARTED and', function() {
        it('should save the applied parameters to "lastSearchParams"', function() {
            appState.setType(types.poi);
            appState.setArea(testUtils.createRandomBoxArea('Athens'));
            appState.setKeyword('some');
            eventService.broadcastEvent(constants.MAIN_QUERY_STARTED, appState.getParams());
            expect(scope.lastSearchParams.equals(appState.getParams())).to.be.true();
        });
        it('should set the "reachedTheEnd" parameter to false', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_STARTED);
            expect(scope.reachedTheEnd).to.be.false();
        });
    });

    describe('exposes "fetchNextPage" method that', function() {
        beforeEach(function() {
            //save the params
            appState.setKeyword('some');
            appState.setType(types.poi);
            appState.setArea(testUtils.createRandomBoxArea('Area'));
            scope.lastSearchParams = appState.getParams();
        });

        it('should not call the SearchService if the lastSearchParams are undefined', function() {
            var spy = sinon.spy();
            searchService.query = function (params) {
                spy(params);
                return {
                    then: function() {}
                }
            };
            scope.lastSearchParams = undefined;
            scope.fetchNextPage();
            expect(spy).to.have.callCount(0);
        });

        it('should call the search service for the next page using the lastSearchParams', function() {
            var spy = sinon.spy();
            searchService.query = function (params) {
                spy(params);
                return {
                    then: function() {}
                }
            };
            scope.fetchNextPage();
            var capturedParams = spy.getCall(0).args[0];
            expect(capturedParams.page).to.equal(2);

            scope.lastSearchParams.page = 2;
            scope.fetchNextPage();
            capturedParams = spy.getCall(1).args[0];
            expect(capturedParams.page).to.equal(3);
        });

        it('should fire a FETCH_NEXT_PAGE_STARTED event', function() {
            searchService.query = function () {
                return {
                    then: function() {}
                }
            };
            eventService.broadcastEvent = sinon.spy();
            scope.fetchNextPage();
            expect(scope.queryRunning).to.be.true();
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.FETCH_NEXT_PAGE_STARTED);
        });

        it('should set the next page to the lastSearchParams on success', function() {
            scope.lastSearchParams.page = 2;
            scope.fetchNextPage();
            expect(scope.queryRunning).to.be.false();
            expect(scope.lastSearchParams.page).to.equal(3);
        });

        it('should fire a FETCH_NEXT_PAGE_SUCCESS on success that contains the new data', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.fetchNextPage();
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.FETCH_NEXT_PAGE_SUCCESS, mockedData);
        });

        it('should not set the next page to the lastSearchParams on error', function() {
            searchService = testUtils.createSearchServiceMockThatFails();
            initController();
            scope.lastSearchParams.page = 2;
            scope.fetchNextPage();
            expect(scope.queryRunning).to.be.false();
            expect(scope.lastSearchParams.page).to.equal(2);
        });

        it('should fire a FETCH_NEXT_PAGE_FAILURE on error', function() {
            searchService = testUtils.createSearchServiceMockThatFails();
            initController();
            eventService.broadcastEvent = sinon.spy();
            scope.fetchNextPage();
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.FETCH_NEXT_PAGE_FAILURE);
        });

        it('should set the reachedTheEnd to true if the server responds with an empty collection', function() {
            searchService = testUtils.createSearchServiceMock(emptyResponse);
            initController();
            eventService.broadcastEvent = sinon.spy();
            scope.fetchNextPage();
            expect(scope.reachedTheEnd).to.be.true();
            expect(eventService.broadcastEvent).to.have.callCount(1); // fired only the start event (not the success)
        });
    });

    describe('exposes isPaginable method that', function() {
        it('should return false when result contains paginable set to false', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, require('../../data/poisForStreetResponse'));
            expect(scope.isPaginable()).to.be.false();
        });

        it('should return true when result contains paginable set to true', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, require('../../data/poiResponse'));
            expect(scope.isPaginable()).to.be.true();
        });

        it('should return false when no query has been finished yet', function() {
            expect(scope.isPaginable()).to.be.false();
        });
    });

    function initController() {
        $$controller('ResultsPaginationController',
            {$scope: scope, AppState: appState, NgEventService: eventService, SearchService: searchService});
    }

});