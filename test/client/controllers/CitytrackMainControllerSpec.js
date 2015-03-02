'use strict';

require('angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');

describe('CitytrackMainController', function() {
    var scope, eventService, $$controller;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope) {
        $$controller = $controller;
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
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

    function initController() {
        $$controller('CitytrackMainController',
            {$scope: scope, NgEventService: eventService});
    }
});
