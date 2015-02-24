'use strict';

require('angular');
require('angular-mocks');
var controller = require('client/controllers/AreaSelectController');
var constants = require('client/config/constants');

describe('AreaSelectController', function() {
    var scope;

    beforeEach(function() {
        scope = {};
        controller(scope);
    });

    it('should setup the config of the selectize component', function() {
        expect(scope.config).not.to.be.undefined;
    });

    it('should initialize the areas to an empty array', function() {
        expect(scope.areas).to.deep.equal([]);
    });

    describe('initializes areas by querying the area service and', function() {
        it('should configure the current user address', function() {

        });

        it('should configure the available areas from the server', function() {

        });
    })
});
