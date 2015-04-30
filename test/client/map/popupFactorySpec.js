'use strict';

var $ = require('jquery');
require('client/shims/angular');
require('angular-mocks');
var directives = require('client/directives/directives');
var controllers = require('client/controllers/controllers');
var popupFactory = require('client/map/popupFactory');
var mockedPois= require('../../data/poiResponse').collection.features;
var utils = require('common/utils');
var latLng = require('leaflet').latLng;

describe('popupFactory', function() {
    var $compile, $rootScope;

    beforeEach(angular.mock.module('templates/resultRow.html'));
    beforeEach(angular.mock.module('templates/mapContext.html'));

    beforeEach(angular.mock.module(controllers.name));
    beforeEach(angular.mock.module(directives.name));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    describe('getPopupHmtl', function() {
        it('should return a valid template for a poi', function() {
            var poi = mockedPois[0];
            var element = popupFactory.getPopupElement(poi, $compile, $rootScope);
            $rootScope.$digest();

            var categories = utils.getArrayFromString(poi.properties.category);
            var $element = $(element);
            expect($element.find('.title:first').text()).to.equal(poi.properties.label);
            expect($element.find('.description > span').text()).to.equal(poi.properties.description);
            expect($element.find('.categories').html()).to.contain(categories[0]);
            expect($element.find('.categories').html()).to.contain(categories[1]);
            expect($element.find('.source').html()).to.contain(poi.properties.url);
        });

        it('should work on a copy of the feature', function() {
            var poi = mockedPois[0];
            popupFactory.getPopupElement(poi, $compile, $rootScope);
            expect(poi.properties.target).to.be.undefined();
        });
    });

    describe('getContextPopup', function() {
        it('should return a valid context template element', function() {
            var element = popupFactory.getContextPopup(latLng(2, 5), $compile, $rootScope);
            $rootScope.$digest();
            var $element = $(element);
            expect($element.find('ul.entries:first > li').length > 0).to.be.true();
        });
    });
});
