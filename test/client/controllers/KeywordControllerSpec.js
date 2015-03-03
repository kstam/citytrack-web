'use strict';

require('angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var expect = require('../../testCommons/chaiExpect');
var sinon = require('sinon');

describe('AreaSelectController', function() {
    var scope, appState, eventService, $$controller;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope) {
        $$controller = $controller;
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        initController();
    }));

    it('should initialize the keyword to an empty string', function() {
        expect(scope.keyword).to.equal('');
    });

    it('should initialize the keyword from the appState if possible', function() {
        appState.setKeyword('aKeyword');
        initController();
        expect(scope.keyword).to.equal(appState.getKeyword());
    });

    describe('updates the AppState and', function() {
        it('should set the keyword to the appState when it changes', function() {
            initController();
            scope.$digest();
            scope.keyword = 'new keyword';
            scope.$digest();
            expect(appState.getKeyword()).to.equal(scope.keyword);
        });
    });

    describe('listens to events and', function() {
        it('should update the keyword if the AppState keyword changes', function() {
            scope.$digest();
            appState.setKeyword('bla');
            scope.$digest();
            expect(scope.keyword).to.equal('bla');
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
        $$controller('KeywordController',
            {$scope: scope, AppState: appState, NgEventService: eventService});
    }
});