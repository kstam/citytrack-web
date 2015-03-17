'use strict';

require('angular');
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
            expect(scope.categories).to.contain({name: constants.ANY_CATEGORY});
        });

        it('should set an initial config', function() {
            expect(scope.config).not.to.be.undefined();
        });

        it('should init the selectedCategory to ANY', function() {
            expect(scope.selectedCategory).to.equal(constants.ANY_CATEGORY);
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
            scope.selectedCategory = constants.ANY_CATEGORY;
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
            expect(scope.selectedCategory).to.equal(constants.ANY_CATEGORY);
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

    function mockServiceForError() {
        var mockedCategories = ['Food', 'Service'];
        mockedCategoryService.getCategories = function() {
            return {
                then: function(success, error) {
                    error();
                }
            }
        };
    }

    function initController() {
        $$controller('CategorySelectController',
            {$scope: scope, CategoryService: mockedCategoryService, AppState: appState, NgEventService: eventService});
    }

});
