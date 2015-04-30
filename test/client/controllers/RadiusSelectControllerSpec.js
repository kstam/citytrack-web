'use strict';
require('client/shims/angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var types = require('model/types');
var testUtils = require('../../testCommons/testUtils');

describe('RadiusSelectController', function() {
    var scope, appState, eventService, $$controller;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope) {
        $$controller = $controller;
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        initController();
    }));


    describe('listens to radius for changes and', function() {
        it('should update the selected area and the map and the appState with the new value', function() {
            appState.setArea(testUtils.createRandomCircleArea('Athens'));
            scope.$digest();

            scope.radius = appState.getArea().getRadius() - 1;
            scope.$digest();

            expect(appState.getArea().getRadius()).to.equal(scope.radius);
        });

        it('should update the radius back to what it was if it is invalid', function() {
            appState.setArea(testUtils.createRandomCircleArea('Athens'));
            scope.$digest();

            scope.radius = 'a';
            scope.$digest();

            expect(scope.radius).not.to.equal(appState.getArea().getRadius());
        });
    });

    describe('listens to AppState changes and', function() {
        it('should update the radius to the new value', function() {
            appState.setArea(testUtils.createRandomCircleArea('Athens'));
            scope.$digest();
            expect(scope.radius).to.equal(appState.getArea().getRadius());
        });
    });

    function initController() {
        $$controller('RadiusSelectController',
            {$scope: scope, AppState: appState, NgEventService: eventService});
    }
});

