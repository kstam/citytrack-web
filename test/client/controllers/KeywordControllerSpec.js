'use strict';

require('angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var types = require('model/types');

describe('KeywordController', function() {
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
    
    describe('shouldHide', function() {
        it('should return true for the appropriate types', function() {
            appState.setType(types.streetofinterest);
            expect(scope.shouldHide()).to.be.true();
            appState.setType(types.scenicstreets);
            expect(scope.shouldHide()).to.be.true();
            appState.setType(types.regionofinterest);
            expect(scope.shouldHide()).to.be.true();
        });

        it('should return false for the appropriate types', function() {
            appState.setType(types.poi);
            expect(scope.shouldHide()).to.be.false();
            appState.setType(types.photo);
            expect(scope.shouldHide()).to.be.false();
            appState.setType(types.event);
            expect(scope.shouldHide()).to.be.false();
        });
    });

    function initController() {
        $$controller('KeywordController',
            {$scope: scope, AppState: appState, NgEventService: eventService});
    }
});