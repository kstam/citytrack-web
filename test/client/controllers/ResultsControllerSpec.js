'use strict';

require('angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');
var constants = require('client/config/constants');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var expect = require('../../testCommons/chaiExpect');
var sinon = require('sinon');
var mockedData1 = require('../../data/poiResponse');
var mockedData2 = require('../../data/poiResponse2');

describe('ResultsController', function() {
    var scope, appState, eventService, $$controller;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope) {
        $$controller = $controller;
        scope = $rootScope.$new();
        eventService = new NgEventService($rootScope);
        appState = new AppState(eventService);
        initController();
    }));

    describe('defines an initial state and', function() {
        it('should set the "rows" to an empty array', function() {
            expect(scope.rows).to.deep.equal([]);
        });

        it('should set the "error" to false', function() {
            expect(scope.error).to.be.false();
        });
    });

    describe('listens to MAIN_QUERY_SUCCESS and', function() {
        it('should set the "rows" to the array contained in the collection', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData1);
            expect(scope.rows).to.deep.equal(mockedData1.collection.features);
        });

        it('should set the error back to false', function() {
            scope.error = true;
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData1);
            expect(scope.error).to.be.false();
        });

        it('should set the "rows" to empty array when collection is empty or doesnt exist', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS);
            expect(scope.rows).to.deep.equal([]);

            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, {});
            expect(scope.rows).to.deep.equal([]);

            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, {collection: {}});
            expect(scope.rows).to.deep.equal([]);

            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, {collection: {
                features: null
            }});
            expect(scope.rows).to.deep.equal([]);
        });
    });

    describe('listens to MAIN_QUERY_FAILURE and', function() {
        it('should set the "error" to true', function() {
            eventService.broadcastEvent(constants.MAIN_QUERY_FAILURE);
            expect(scope.error).to.be.true();
        });

        it('should set the "rows" back to the empty array', function() {
            scope.rows = ['a'];
            eventService.broadcastEvent(constants.MAIN_QUERY_FAILURE);
            expect(scope.rows).to.deep.equal([]);
        });
    });

    describe('listens to FETCH_NEXT_PAGE_SUCCESS and', function() {
        beforeEach(function() { // set the first page
            eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, mockedData1);
        });

        it('should add the new results to the rows', function() {
            eventService.broadcastEvent(constants.FETCH_NEXT_PAGE_SUCCESS, mockedData2);
            expect(scope.rows).to.deep.equal(mockedData1.collection.features.concat(mockedData2.collection.features));
        });
    });

    describe('expose "selectRow" method in the scope that', function() {
        it('should set the "selectedRow" property to the id of the selectedFeature', function() {
            scope.selectRow('anyId');
            expect(scope.selectedRow).to.equal('anyId');
        });

        it('should fire a RESULTS_ROW_SELECTED event', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.selectRow('anyId');
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.RESULTS_ROW_SELECTED, 'anyId');
        });
    });

    describe('expose "isRowSelected" method in the scope that', function() {
        it('should return true if the passed id equals the "selectedRow"', function() {
            scope.selectedRow = 'id1';
            expect(scope.isRowSelected('id1')).to.be.true();
            expect(scope.isRowSelected(String('id1'))).to.be.true();
            expect(scope.isRowSelected('id2')).to.be.false();

        });
    });

    describe('expose "rowMouseOver" method that', function() {
        it('should fire a RESULTS_ROW_MOUSE_OVER event', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.rowMouseOver('rowId');
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.RESULTS_ROW_MOUSE_OVER, 'rowId');
        });
    });

    describe('expose "rowMouseOut" method that', function() {
        it('should fire a RESULTS_ROW_MOUSE_OVER event', function() {
            eventService.broadcastEvent = sinon.spy();
            scope.rowMouseOut('rowId');
            expect(eventService.broadcastEvent).to.have.been.calledWith(constants.RESULTS_ROW_MOUSE_OUT, 'rowId');
        });
    });

    describe('listens to MAP_FEATURE_SELECTED event and', function() {
        it('should update the selectedRow from the event', function() {
            eventService.broadcastEvent(constants.MAP_FEATURE_SELECTED, 'someId');
            expect(scope.selectedRow).to.equal('someId');
        });
    });

    // HELPER FUNCTIONS

    function initController() {
        $$controller('ResultsController',
            {$scope: scope, AppState: appState, NgEventService: eventService});
    }

});