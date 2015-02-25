'use strict';

require('angular');
require('angular-mocks');
var controller = require('client/controllers/AreaSelectController');
var constants = require('client/config/constants');
var testUtils = require('../../testCommons/testUtils');

describe('AreaSelectController', function() {
    var scope, mockedAreaService;

    beforeEach(inject(function($rootScope) {
        scope = $rootScope.$new();
        createMockedAreaService();
        controller(scope, mockedAreaService);
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

    describe('initializes areas by querying the area service and', function() {
        it('should load the areas from the server and create a map for them', function() {
            mockServiceForSuccess();
            controller(scope, mockedAreaService);
            expect(scope.areaMap['Athens']).not.to.equal(undefined);
            expect(scope.areaMap['London']).not.to.equal(undefined);
        });

        it('should configure the current user address', function() {
            mockServiceForSuccess();
            controller(scope, mockedAreaService);
            expect(scope.currentArea).not.to.equal(undefined);
            expect(scope.areaMap[constants.CURRENT_AREA_ID]).not.to.equal(undefined);
        });
    });

    it('should update the options array when the areaMap changes', function() {
        scope.$digest();
        scope.areaMap.this = testUtils.createRandomArea('Berlin');
        scope.$digest();
        expect(scope.areas.length).to.equal(1);
        expect(scope.areas[0].getName()).to.equal('Berlin');
    });

    //Test helpers

    function createMockedAreaService() {
        mockedAreaService = {
            getAreas: function() {
            },
            getCurrentArea: function() {
            }
        };
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
