'use strict';

require('angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');

describe('controllers', function() {

    beforeEach(angular.mock.module(controllers.name));

    it('should define a CitytrackMainController', inject(function($controller) {
        var scope = {};
        var controller = $controller('CitytrackMainController', {$scope:scope});
        expect(controller).to.not.be.null();
    }));

    it('should define an AreaSelectController', inject(function($controller) {
        var scope = {};
        var controller = $controller('AreaSelectController', {$scope:scope});
        expect(controller).to.not.be.null();
    }));
});
