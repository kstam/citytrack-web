'use strict';

var angular = require('../shims/angular');
var constants = require('../config/constants');
var types = require('../../model/types');

module.exports = function($scope, appState, eventService) {

    $scope.toggle = function() {
        $scope.visible = !$scope.visible;
    };

    var setDefaults = function() {
        $scope.visible = false;
    };

    // INITIALIZER
    var initialize = function() {
        setDefaults();
    };

    initialize();
};
