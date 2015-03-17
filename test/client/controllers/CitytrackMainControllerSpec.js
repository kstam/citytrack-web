'use strict';

require('angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var expect = require('../../testCommons/chaiExpect');
var sinon = require('sinon');

describe('CitytrackMainController', function() {
    var scope, eventService, $$controller, appState;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope) {
        $$controller = $controller;
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        initController();
    }));

    it('should initialize the "displayResults" to false', function() {
        expect(scope.displayResults).to.be.false();
    });

    describe('listens to events and', function() {
        it('should change the displayResults to false on MAIN_QUERY_SUCCESS', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, {});
            expect(scope.displayResults).to.be.true();
        });

        it('should change the displayResults to false on MAIN_QUERY_FAILURE', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_FAILURE);
            expect(scope.displayResults).to.be.true();
        });
    });

    describe('defines processKeyPress that', function() {
        it('should send a KEYWORD_ENTER_PRESSED event if enter was pressed', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.processKeyPress({keyCode: 13});
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.KEYWORD_ENTER_PRESSED);
        });

        it('should not send any event if any other key was pressed', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.processKeyPress({keyCode: 14});
            expect(eventService.broadcastEvent).to.have.callCount(0);
        });
    });

    function initController() {
        $$controller('CitytrackMainController',
            {$scope: scope, AppState: appState, NgEventService: eventService});
    }
});
