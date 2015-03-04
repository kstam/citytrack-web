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
    var scope, appState, eventService, $$controller, poiService;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope) {
        $$controller = $controller;
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        poiService = createPoiServiceMock();
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

            var newArea = testUtils.createRandomArea('Athens');
            appState.setArea(newArea);
            expect(scope.params.area.equals(newArea)).to.be.true();
        });

        it('should update the value of the "active" to true if the params are valid', function() {
            appState.setKeyword('hello');
            appState.setArea(testUtils.createRandomArea('Athens'));
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

    describe('exposes "search" method to the scope that', function() {
        it('should do nothing if active is false"', function() {
            poiService.getPois = sinon.spy();
            scope.search();
            expect(poiService.getPois).to.have.callCount(0);
        });

        it('should call the poiService if active is set to true and set "loading" to true', function() {
            var spy = sinon.spy();
            poiService.getPois = function() {
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
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.MAIN_QUERY_STARTED);
        });

        it('should trigger an event to notify that the main query finished successfully and unset "loading"', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.active = true;
            scope.search();
            expect(scope.loading).to.be.false();
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.MAIN_QUERY_SUCCESS, mockedData);
        });

        it('should trigger an ERROR event if the service call failse', function() {
            poiService = createPoiServiceMockThatFails();
            initController();
            eventService.broadcastEvent = sinon.spy();
            scope.active = true;
            scope.search();
            expect(scope.loading).to.be.false();
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.MAIN_QUERY_FAILURE);
        });
    });

    function initController() {
        $$controller('SearchButtonController',
            {$scope: scope, AppState: appState, NgEventService: eventService, PoiService: poiService});
    }

    function createPoiServiceMock() {
        return {
            getPois: function() {
                return {
                    then: function(success) {
                        success(mockedData);
                    }
                };
            }
        };
    }

    function createPoiServiceMockThatFails() {
        return {
            getPois: function() {
                return {
                    then: function(success, failure) {
                        failure();
                    }
                };
            }
        };
    }
});
