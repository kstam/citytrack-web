'use strict';

var $ = require('jquery');
require('angular');
require('angular-mocks');
var directives = require('client/directives/directives');
var mockedData = require('../../data/poiResponse');
var utils = require('common/utils');
var constants = require('client/config/constants');

describe('result-row directive', function() {
    var element, scope, $$compile;

    beforeEach(angular.mock.module('partials/resultRow.html'));

    beforeEach(angular.mock.module(directives.name));

    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        $$compile = $compile;
        element = '<result-row model="row"></result-row>';
    }));

    it('should compile the element using the "row" in the scope', function() {
        scope.row = mockedData.collection.features[0];
        compileDirective();
        expect($(element).find('.title').text()).to.equal(scope.row.properties.label);
        expect($(element).find('.description').text()).to.equal(scope.row.properties.description);
    });

    describe('creates intermediate "data" object and', function() {
        it('should define the correct "categories"', function() {
            scope.row = mockedData.collection.features[0];
            compileDirective();
            var isolateScope = element.isolateScope();
            expect(isolateScope.data.categories).to.deep.equal(utils.getArrayFromString(scope.row.properties.category));
        });
        it('should define "description" correctly when none exists', function() {
            scope.row = mockedData.collection.features[1];
            compileDirective();
            var isolateScope = element.isolateScope();
            expect(isolateScope.data.description).to.equal('No description available.');
        });
        it('should define the "mainPhoto to no-photo when none exist', function() {
            scope.row = mockedData.collection.features[0];
            compileDirective();
            var isolateScope = element.isolateScope();
            expect(isolateScope.data.mainPhoto).to.equal(constants.NO_IMG_URL);
        });
    });

    // Helper functions

    function compileDirective() {
        element = $$compile(element)(scope);
        scope.$digest();
    }
});
