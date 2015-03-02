'use strict';

var constants = require('../config/constants');

module.exports = function($scope, eventService) {

    var setDefaults = function() {
        $scope.displayResults = false;
    };

    // LISTENERS
    var mainQueryListener = function() {
        $scope.displayResults = true;
    };

    var initListeners = function() {
        eventService.on(constants.MAIN_QUERY_SUCCESS, mainQueryListener);
        eventService.on(constants.MAIN_QUERY_FAILURE, mainQueryListener);
    };

    // INITIALIZER
    var initialize = function() {
        setDefaults();
        initListeners();
    };

    initialize();

};
