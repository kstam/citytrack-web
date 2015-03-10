'use strict';

var $ = require('jquery');
require('angular');
require('angular-mocks');
var directives = require('client/directives/directives');
var poiResponse = require('../../data/poiResponse');
var utils = require('common/utils');
var constants = require('client/config/constants');
var fields = require('model/fields');

describe('facet directive', function() {
    var element, scope, $compile, facets;

    beforeEach(angular.mock.module('templates/facetDirective.html'));

    beforeEach(angular.mock.module(directives.name));

    beforeEach(inject(function($rootScope, _$compile_) {
        facets = angular.copy(poiResponse.facets);
        scope = $rootScope.$new();
        $compile = _$compile_;
        element = '<facet facet-list="facetList" model="selected" facet-field="fieldId"></facet>';
    }));

    describe('generates an element for a given facet and', function() {
        it('should contain an entry per facet value with the correct count', function() {
            scope.facetList = facets.source;
            compileDirective();
            var facetElements = $(element).find('.facet');
            expect(facetElements.length).to.equal(scope.facetList.length);
            facetElements.each(function(index, element) {
                expect($(element).text()).to.contain(scope.facetList[index].name);
                expect($(element).text()).to.contain(scope.facetList[index].count);
            });
        });

        it('should add all entries as not selected', function() {
            scope.facetList = facets.source;
            compileDirective();
            var facetElements = $(element).find('.facet');
            expect(facetElements.length).to.equal(scope.facetList.length);
            facetElements.each(function(index, element) {
                expect($(element).hasClass('selected')).to.be.false();
            });
        });

        it('should hide the popup by default', function() {
            scope.facetList = facets.source;
            compileDirective();
            expect($(element).find('.filter-popup').css('display')).to.equal('none');
        });
    });

    describe('exposes isSelected function that', function() {
        it('should return true only if a facet is selected', function() {
            compileDirective();
            var isolateScope = element.isolateScope();
            expect(isolateScope.isSelected('foursquare')).to.be.false();
            isolateScope.modelArray = ['foursquare'];
            isolateScope.$digest(); //update the internal modelMap
            expect(isolateScope.isSelected('foursquare')).to.be.true();
        });
    });

    describe('exposes select function that', function() {
        it('should add a value to the model', function() {
            compileDirective();
            var isolateScope = element.isolateScope();
            isolateScope.toggle('foursquare');
            isolateScope.$digest(); //update the internal modelMap
            expect(isolateScope.isSelected('foursquare')).to.be.true();
            expect(isolateScope.modelArray.length).to.equal(1);

            isolateScope.toggle('foursquare');
            isolateScope.$digest(); //update the internal modelMap
            expect(isolateScope.isSelected('foursquare')).to.be.false();
            expect(isolateScope.modelArray.length).to.equal(0);
        });
    });

    describe('exposes "showPopup" and "hidePopup" methods that', function() {
        it('should show the popup if the popup was not visible before', function() {
            compileDirective();
            var isolateScope = element.isolateScope();
            isolateScope.showPopup();
            expect($(element).find('.filter-popup').css('display')).not.to.equal('none');
        });

        it('should hide the popup if the popup was visible before', function() {
            compileDirective();
            var isolateScope = element.isolateScope();
            isolateScope.showPopup();
            isolateScope.hidePopup();
            expect($(element).find('.filter-popup').css('display')).to.equal('none');
        });
    });

    describe('exposes "cancel" method that', function() {
        it('should hide the popup', function() {
            compileDirective();
            var isolateScope = element.isolateScope();
            isolateScope.showPopup();
            isolateScope.cancel();
            expect($(element).find('.filter-popup').css('display')).to.equal('none');
        });

        it('should not extract any changes to the model in the parent scope', function() {
            compileDirective();
            var isolateScope = element.isolateScope();
            isolateScope.toggle('foursquare');
            isolateScope.cancel();

            expect(scope.selected).to.be.undefined();
        });

        it('should reset any changes made to the popup', function() {
            compileDirective();
            var isolateScope = element.isolateScope();
            isolateScope.toggle('foursquare');
            scope.$digest();

            isolateScope.ok();
            scope.$digest();

            isolateScope.toggle('dbpedia');
            scope.$digest();

            isolateScope.cancel();
            scope.$digest();
            expect(isolateScope.modelMap['foursquare']).to.be.true();
            expect(isolateScope.modelMap['dbpedia']).to.be.undefined();
        });
    });

    describe('exposes "ok" method that', function() {
        it('should hide the popup', function() {
            compileDirective();
            var isolateScope = element.isolateScope();
            isolateScope.showPopup();
            isolateScope.ok();
            expect($(element).find('.filter-popup').css('display')).to.equal('none');
        });

        it('should extract any changes to the model in the parent scope', function() {
            compileDirective();
            var isolateScope = element.isolateScope();
            isolateScope.toggle('foursquare');
            isolateScope.$digest();
            isolateScope.ok();
            scope.$digest();
            console.log(scope.selected);
            expect(scope.selected).to.deep.equal(isolateScope.modelArray);
        });
    });

    describe('exposes "getFieldLabel" method that', function() {
        it('should return the userFriendly label for an id that exists in the fields', function() {
            scope.fieldId = fields.CATEGORY_ID;
            compileDirective();
            var isolateScope = element.isolateScope();
            expect(isolateScope.getFieldLabel()).to.equal(utils.capitalizeWords(fields[fields.CATEGORY_ID].userFriendly));
        });

        it('should return the same fieldId for an id that does not exist in the fields', function() {
            scope.fieldId = 'non-existent';
            compileDirective();
            var isolateScope = element.isolateScope();
            expect(isolateScope.getFieldLabel()).to.equal(scope.fieldId);
        });
    });

    describe('watches the "model" for changes and', function() {
        it('recalulcates the modelArray and modelMap', function() {
            scope.selected = [];
            scope.facetList = angular.copy(facets.source);
            compileDirective();

            scope.selected = [scope.facetList[0].name];
            scope.$digest();
            element.isolateScope().$digest();
            expect($(element).find('.facet:first').hasClass('selected')).to.be.true();
        });
    });

    function compileDirective() {
        element = $compile(element)(scope);
        scope.$digest();
    }
});
