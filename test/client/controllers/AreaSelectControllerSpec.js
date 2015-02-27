'use strict';

require('angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var testUtils = require('../../testCommons/testUtils');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');

describe('AreaSelectController', function() {
    var scope, mockedAreaService, appState, eventService, $$controller;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope) {
        $$controller = $controller;
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        createMockedAreaService();
        initController();
    }));

    it('should setup the config of the selectize component', function() {
        expect(scope.config).not.to.be.undefined;
    });

    it('should initialize the areas to an empty array', function() {
        expect(scope.areaMap).to.deep.equal({});
    });

    it('should start with an undefined currentArea', function() {
        expect(scope.currentArea).to.equal(undefined);
    });

    it('should initialize the selectedArea and selectedAreaId to undefined', function() {
        expect(scope.selectedAreaId).to.equal(undefined);
        expect(scope.selectedArea).to.equal(undefined);
    });

    describe('initializes areas by querying the area service and', function() {
        it('should load the areas from the server and create a map for them', function() {
            mockServiceForSuccess();
            initController();
            expect(scope.areaMap['Athens']).not.to.equal(undefined);
            expect(scope.areaMap['London']).not.to.equal(undefined);
        });

        it('should configure the current user address', function() {
            mockServiceForSuccess();
            initController();
            expect(scope.currentArea).not.to.equal(undefined);
            expect(scope.areaMap[constants.CURRENT_AREA_ID]).not.to.equal(undefined);
        });
    });

    describe('watches the selectedAreaId for changes and', function() {
        it('should update the selectedArea', function() {
            scope.areaMap.Berlin = testUtils.createRandomArea('Berlin');
            scope.$digest();

            scope.selectedAreaId = 'Berlin';
            scope.$digest();

            expect(scope.selectedArea).to.equal(scope.areaMap.Berlin);
        });

        it('should update the appState with the new area', function() {
            scope.areaMap.Berlin = testUtils.createRandomArea('Berlin');
            scope.$digest();
            expect(appState.getArea()).to.equal(undefined);

            scope.selectedAreaId = 'Berlin';
            scope.$digest();
            expect(scope.areaMap.Berlin.equals(appState.getArea())).to.equal(true);
        });
    });

    describe('watches the areaMap for changes and', function() {
        it('should update the options array', function() {
            scope.$digest();
            scope.areaMap['Berlin'] = testUtils.createRandomArea('Berlin');
            scope.$digest();
            expect(scope.areas.length).to.equal(1);
            expect(scope.areas[0].getName()).to.equal('Berlin');
        });
    });

    describe('listens to AppState changes and', function() {
        it('should update the selectedArea and the selectedAreaId to the new value', function() {
            scope.areaMap['Berlin'] = testUtils.createRandomArea('Berlin');
            scope.areaMap['Athens'] = testUtils.createRandomArea('Athens');
            scope.$digest();
            appState.setArea(testUtils.createRandomArea('Athens'));
            scope.$digest();
            expect(scope.selectedAreaId).to.equal('Athens');
            expect(scope.selectedArea.equals(appState.getArea())).to.equal(true);
        });
    });

    // Test helpers start here
    function createMockedAreaService() {
        mockedAreaService = {
            getAreas: function() {
            },
            getCurrentArea: function() {
            }
        };
    }

    function initController() {
        $$controller('AreaSelectController',
            {$scope: scope, AreaService: mockedAreaService, AppState: appState, NgEventService: eventService});
    }

    function mockServiceForSuccess() {
        var mockedData = [testUtils.createRandomArea('Athens'), testUtils.createRandomArea('London')];
        mockedAreaService.getAreas = function(callback) {
            callback(undefined, mockedData);
        };
        mockedAreaService.getCurrentArea = function(callback) {
            callback(undefined, testUtils.createRandomArea(constants.CURRENT_AREA_ID));
        };
    }

    function mockServiceForError() {
        mockedAreaService.getAreas = function(callback) {
            callback(new Error('message'));
        };
        mockedAreaService.getCurrentArea = function(callback) {
            callback(new Error('message'));
        };
    }
});
