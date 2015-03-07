'use strict';

var $ = require('jquery');
require('angular');
require('angular-mocks');
var directives = require('client/directives/directives');
var utils = require('common/utils');
var constants = require('client/config/constants');

describe('err-src directive', function() {
    var fallbackImage = 'base/public/img/no_image_available.jpg';
    var element, scope, $$compile;

    beforeEach(angular.mock.module(directives.name));

    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        $$compile = $compile;
    }));

    it('should hide the element if image url is not found and err-src is empty', function(done) {
        compileDirective('wrong', '');
        var $element = $(element);
        $element.bind('error', function(event) {
            expect($element.css('display')).to.equal('none');
            event.preventDefault();
            done();
        });
    });

    it('should hide the element if image url is not found and err-src is the same url', function(done) {
        compileDirective('wrong', 'wrong');
        var $element = $(element);
        $element.bind('error', function(event) {
            expect($element.css('display')).to.equal('none');
            event.preventDefault();
            done();
        });
    });

    it('should replace the img src with the fallbackUrl if ng-src results in error and err-src is different', function(done) {
        compileDirective('wrong', fallbackImage);
        $(element).bind('error', function(event) {
            expect($(element).attr('src')).to.equal(fallbackImage);
            event.preventDefault();
            done();
        });
    });

    // Helper functions

    function compileDirective(url, fallbackUrl) {
        element = '<img ng-src="' + url + '" err-src="' + fallbackUrl + '"/>';
        element = $$compile(element)(scope);
        scope.$digest();
    }
});
