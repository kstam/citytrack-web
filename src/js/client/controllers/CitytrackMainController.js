'use strict';

var constants = require('../config/constants');
var ENTER_KEY_CODE = 13;

module.exports = function($scope, appState, eventService) {

    $scope.processKeyPress = function($event) {
        if ($event.keyCode === ENTER_KEY_CODE) {
            eventService.broadcastEvent(constants.KEYWORD_ENTER_PRESSED);
        }
    };

    $scope.selectedType = function() {
        return appState.getType().id;
    };

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
