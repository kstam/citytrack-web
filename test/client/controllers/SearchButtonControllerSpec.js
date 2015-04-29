'use strict';

require('angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var mockedData = require('../../data/poiResponse');
var testUtils = require('../../testCommons/testUtils');
var Params = require('model/Params');
var types = require('model/types');
var expect = require('../../testCommons/chaiExpect');
var sinon = require('sinon');


describe('SearchButtonController', function() {
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

    it('should initialize "active" to false', function() {
        expect(scope.active).to.be.false();
    });

    it('should initialize "params" to an empty Params object', function() {
        expect(scope.params.equals(new Params(''))).to.be.true();
    });

    it('should initialize "loading" to false', function() {
        expect(scope.loading).to.be.false();
    });

    describe('listens to AppState changes and', function() {
        it('should update the params object accordingly', function() {
            appState.setKeyword('hello');
            expect(scope.params.keyword).to.equal('hello');

            var newArea = testUtils.createRandomBoxArea('Athens');
            appState.setArea(newArea);
            expect(scope.params.area.equals(newArea)).to.be.true();
        });

        it('should update the value of the "active" to true if the params are valid', function() {
            appState.setKeyword('hello');
            appState.setArea(testUtils.createRandomBoxArea('Athens'));
            appState.setType(types.poi);
            expect(scope.active).to.be.true();
        });

        it('should leave the value of active to false if the params are invalid', function() {
            appState.setKeyword('');
            expect(scope.active).to.be.false();
        });
    });

    describe('listens to KEYWORD_ENTER_PRESSED event and', function() {
        it('should invoke the search method', function() {
            scope.search = sinon.spy();
            eventService.broadcastEvent(constants.KEYWORD_ENTER_PRESSED);
            expect(scope.search).to.have.callCount(1);
        });
    });

    describe('listens to MAP_VIEW_CHANGED event and', function() {
        it('should invoke the search method', function() {
            scope.search = sinon.spy();
            eventService.broadcastEvent(constants.MAP_VIEW_CHANGED);
            expect(scope.search).to.have.callCount(1);
        });
    });

    describe('listens to FILTER_CHANGED_EVT event and', function() {
        it('should invoke the search method', function() {
            scope.search = sinon.spy();
            eventService.broadcastEvent(constants.FILTER_CHANGED_EVT);
            expect(scope.search).to.have.callCount(1);
        });
    });

    describe('exposes "search" method to the scope that', function() {
        it('should do nothing if active is false"', function() {
            searchService.query = sinon.spy();
            scope.search();
            expect(searchService.query).to.have.callCount(0);
        });

        it('should call the searchService if active is set to true and set "loading" to true', function() {
            var spy = sinon.spy();
            searchService.query = function() {
                return {
                    then: spy
                };
            };
            scope.active = true;
            scope.search();
            expect(scope.loading).to.be.true();
            expect(spy).to.have.callCount(1);
        });

        it('should trigger an event to notify that it started querying', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.active = true;
            scope.search();
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.MAIN_QUERY_STARTED, scope.params);
        });

        it('should trigger an event to notify that the main query finished successfully and unset "loading"', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.active = true;
            scope.search();
            expect(scope.loading).to.be.false();
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.MAIN_QUERY_SUCCESS, mockedData);
        });

        it('should trigger an ERROR event if the service call fails', function() {
            searchService = testUtils.createSearchServiceMockThatFails();
            initController();
            eventService.broadcastEvent = sinon.spy();
            scope.active = true;
            scope.search();
            expect(scope.loading).to.be.false();
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.MAIN_QUERY_FAILURE);
        });
    });

    describe('exposes "searchButtonClick" method that', function() {

        it('should reset the categories and the sources if a new keyword is selected', function() {
            appState.setType(types.poi);
            appState.setKeyword('old');
            appState.setArea(testUtils.createRandomBoxArea('Athens'));
            scope.searchButtonClick();

            appState.setCategories(['Technology']);
            appState.setSources(['foursquare']);
            scope.searchButtonClick();

            expect(appState.getCategories()).to.deep.equal(['Technology']);
            expect(appState.getSources()).to.deep.equal(['foursquare']);
            appState.setKeyword('new');
            scope.searchButtonClick();

            expect(appState.getCategories()).to.deep.equal([]);
            expect(appState.getSources()).to.deep.equal([]);
        });

        it('should not reset the categories when the type is "streetofinterest"', function() {
            appState.setType(types.streetofinterest);
            appState.setArea(testUtils.createRandomBoxArea('Athens'));
            appState.setCategories(['Food']);
            scope.search();

            expect(appState.getCategories()).to.deep.equal(['Food']);
            appState.setArea(testUtils.createRandomBoxArea('Berlin'));
            scope.search();

            expect(appState.getCategories()).to.deep.equal(['Food']);
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

    describe('listens to MAIN_QUERY_STARTED event and', function() {
        it('should set the loading to true', function() {
            expect(scope.loading).to.be.false();
            eventService.broadcastEvent(constants.MAIN_QUERY_STARTED, appState.getParams());
            expect(scope.loading).to.be.true();
        });
    });
    function initController() {
        $$controller('SearchButtonController',
            {$scope: scope, AppState: appState, NgEventService: eventService, SearchService: searchService});
    }
});
