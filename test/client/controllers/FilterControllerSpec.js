'use strict';

require('angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var types = require('model/types');
var fields = require('model/fields');
var expect = require('../../testCommons/chaiExpect');
var sinon = require('sinon');
var poiData = require('../../data/poiResponse');
var photoData = require('../../data/photoResponse');

describe('ResultsController', function() {
    var scope, appState, eventService, $controller;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function(_$controller_, $rootScope) {
        $controller = _$controller_;
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        initController();
    }));

    describe('sets a default state and', function() {
        it('should set the facets to empty array', function() {
            expect(scope.facets).to.deep.equal({});
        });

        it('should initialize the "selectedFacets" to an empty object', function() {
            expect(scope.selectedFacets).to.deep.equal({});
        });
    });

    describe('listens to MAIN_QUERY_SUCCESS and', function() {
        it('should set the "facets" property from the response', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, poiData);
            expect(scope.facets).to.equal(poiData.facets);

            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, photoData);
            expect(scope.facets).to.equal(photoData.facets);
        });
    });

    describe('watches the "selectedFacets" for changes and', function() {

        it('should save to the "appState" any changes in the selected categories', function() {
            scope.$digest();
            scope.selectedFacets[fields.CATEGORY_ID] = ['Religion'];
            scope.$digest();
            expect(appState.getCategories()).to.equal(scope.selectedFacets[fields.CATEGORY_ID]);
        });

        it('should save to the "appState" any changes in the selected sources', function() {
            scope.$digest();
            scope.selectedFacets[fields.SOURCE_ID] = ['foursquare'];
            scope.$digest();
            expect(appState.getSources()).to.equal(scope.selectedFacets[fields.SOURCE_ID]);
        });

        it('should fire an event to notify that the filters where changed', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.$digest();
            scope.selectedFacets[fields.SOURCE_ID] = ['foursquare'];
            scope.$digest();
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.FILTER_CHANGED_EVT);
        });
    });

    describe('listens to appState events and', function() {
        it('should update the selectedFacets from the appState for categories', function() {
            scope.$digest();
            appState.setCategories(['Religion']);
            expect(scope.selectedFacets[fields.CATEGORY_ID]).to.deep.equal(['Religion']);
            appState.setCategories([]);
            expect(scope.selectedFacets[fields.CATEGORY_ID]).to.deep.equal([]);
        });

        it('should update the selectedFacets from the appState for sources', function() {
            scope.$digest();
            appState.setSources(['foursquare']);
            expect(scope.selectedFacets[fields.SOURCE_ID]).to.deep.equal(['foursquare']);
        });
    });

    // HELPER FUNCTIONS
    function initController() {
        $controller('FilterController',
            {$scope: scope, AppState: appState, NgEventService: eventService});
    }

});