'use strict';

var $ = require('jquery');
require('client/shims/angular');
require('angular-mocks');
var directives = require('client/directives/directives');
var controllers = require('client/controllers/controllers');
var utils = require('common/utils');
var types = require('model/types');
var constants = require('client/config/constants');
var expect = require('../../testCommons/chaiExpect');
var sinon = require('sinon');
var latLng = require('leaflet').latLng;

describe('map-context directive', function() {
    var element, scope, $$compile, eventService, appState;

    beforeEach(angular.mock.module('templates/mapContext.html'));

    beforeEach(angular.mock.module(directives.name));
    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($rootScope, $compile, _NgEventService_, _AppState_) {
        scope = $rootScope.$new();
        $$compile = $compile;
        eventService = _NgEventService_;
        appState = _AppState_;
        element = '<map-context point="point"></map-context>>';
    }));

    it('should compile the element', function() {
        compileDirective();
        expect($(element).find('ul.entries:first > li').length > 0).to.be.true();
    });

    it('should set the point in the isolate scope', function() {
        scope.point = latLng(2, 3);
        compileDirective();
        var isolateScope = element.isolateScope();
        expect(isolateScope.point.equals(scope.point)).to.be.true();
    });

    describe('searchHere function', function() {
        it('should fire an event with the correct point', function() {
            scope.point = latLng(2, 3);
            compileDirective();
            var isolateScope = element.isolateScope();
            isolateScope.searchHere();
            expect(appState.getArea().getCenter()).to.equal(scope.point);
        });
    });
    // Helper functions

    function compileDirective() {
        element = $$compile(element)(scope);
        scope.$digest();
    }
});
