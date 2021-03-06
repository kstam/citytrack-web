'use strict';

require('client/shims/angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var types = require('model/types');

describe('CategorySelectController', function() {
    var scope, appState, eventService, $$controller, mockedCategoryService,
        mockedCategories;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope) {
        $$controller = $controller;
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        mockedCategoryService = {};
        mockServiceForSuccess();
        initController();
    }));

    describe('sets up initial state and', function() {
        it('should set categories from the service and include "Any"', function() {
            mockedCategories.forEach(function(category) {
                expect(scope.categories).to.contain({name: category});
            });
        });

        it('should set an initial config', function() {
            expect(scope.config).not.to.be.undefined();
        });

        it('should init the selectedCategory to ANY', function() {
            expect(scope.selectedCategory).to.be.undefined();
        });
    });

    describe('watches "selectedCategory" and', function() {
        it('should set the selectedCategory in the appState when one is selected', function() {
            scope.$digest();
            scope.selectedCategory = 'Food';
            scope.$digest();
            expect(appState.getCategories().length).to.equal(1);
            expect(appState.getCategories()[0]).to.equal('Food');
        });

        it('should set the "selectedCategories" back to empty array if "Any" is selected', function() {
            scope.$digest();
            scope.selectedCategory = 'Food';
            scope.$digest();
            scope.selectedCategory = undefined;
            scope.$digest();
            expect(appState.getCategories().length).to.equal(0);
        });
    });

    describe('listens to CATEGORIES_CHANGED_EVT event and', function() {
        it('should set the selectedCategory from the appState when one is selected', function() {
            appState.setCategories(['Food']);
            expect(scope.selectedCategory).to.equal('Food');
        });

        it('should set the selectedCategory to Any if none is selected', function() {
            appState.setCategories([]);
            expect(scope.selectedCategory).to.be.undefined();
        });
    });


    describe('shouldShow', function() {
        it('should return true for the appropriate types', function() {
            appState.setType(types.streetofinterest);
            expect(scope.shouldShow()).to.be.true();
            appState.setType(types.regionofinterest);
            expect(scope.shouldShow()).to.be.true();
        });

        it('should return false for the appropriate types', function() {
            appState.setType(types.poi);
            expect(scope.shouldShow()).to.be.false();
            appState.setType(types.photo);
            expect(scope.shouldShow()).to.be.false();
            appState.setType(types.event);
            expect(scope.shouldShow()).to.be.false();
            appState.setType(types.scenicstreets);
            expect(scope.shouldShow()).to.be.false();
        });
    });


    function mockServiceForSuccess() {
        mockedCategories = ['Food', 'Service'];
        mockedCategoryService.getCategories = function() {
            return {
                then: function(success) {
                    success(mockedCategories);
                }
            }
        };
    }

    function initController() {
        $$controller('CategorySelectController',
            {$scope: scope, CategoryService: mockedCategoryService, AppState: appState, NgEventService: eventService});
    }

});
