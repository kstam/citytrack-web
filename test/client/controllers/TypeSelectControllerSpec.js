'use strict';

require('angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var types = require('model/types');

describe('TypeSelectController', function() {
    var scope, appState, eventService, $$controller;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope) {
        $$controller = $controller;
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        initController();
    }));

    describe('initializes defaults and', function() {
        it('should set the "types" from the model', function() {
            expect(scope.types.length).to.equal(Object.keys(types).length);
        });

        it('should set a selectize config', function() {
            expect(scope.config).not.to.be.undefined();
        });

        it('should set the POI type to selected by default', function() {
            expect(scope.selectedTypeId).to.equal(types.poi.id);
        });

        it('updates the appState with the default type', function() {
            expect(appState.getType()).to.equal(types.poi);
        });
    });

    describe('watches the "selectedTypeId" for changes and', function() {
        it('should set the "selectedType" to the correct type', function() {
            expect(scope.selectedType).to.equal(types.poi);
            scope.selectedTypeId = types.event.id;
            scope.$digest();
            expect(scope.selectedType).to.equal(types.event);
        });

        it('should update the appState with the new type', function() {
            scope.selectedTypeId = types.event.id;
            scope.$digest();
            expect(appState.getType()).to.equal(types.event);
        });
    });

    describe('listens to TYPE_CHANGED_EVT and' , function() {
        it('should set the selectedType and selectedTypeId accordingly', function() {
            appState.setType(types.photo);
            expect(scope.selectedTypeId).to.equal(types.photo.id);
            expect(scope.selectedType).to.equal(types.photo);
        });
    });

    function initController() {
        $$controller('TypeSelectController',
            {$scope: scope, AppState: appState, NgEventService: eventService});
        scope.$digest();
    }

});