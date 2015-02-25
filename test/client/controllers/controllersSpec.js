'use strict';

require('angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');

describe('controllers', function() {

    beforeEach(angular.mock.module(controllers.name));

    it('should define a CitytrackMainController', inject(function($rootScope, $controller) {
        var controller = $controller('CitytrackMainController', {$scope:$rootScope});
        expect(controller).to.not.be.null();
    }));

    it('should define an AreaSelectController', inject(function($rootScope, $controller) {
        var areaService = {
            getAreas: function() {},
            getCurrentArea: function() {}
        };
        var controller = $controller('AreaSelectController', {$scope:$rootScope, AreaService: areaService});
        expect(controller).to.not.be.null();
    }));
});
