'use strict';

require('angular');
require('angular-mocks');
var controllers = require('client/controllers/controllers');

describe('MapController', function() {
    var scope, controller;

    beforeEach(angular.mock.module(controllers.name));

    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller('MapController', {$scope: scope});
    }));

    describe('configures an initial state and', function() {
        it('should set currentArea', function() {

        });
    });
});
