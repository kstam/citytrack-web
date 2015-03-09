'use strict';

var angular = require('../shims/angular');
var constants = require('../config/constants');

module.exports = function($scope, appState, eventService, searchService) {

    $scope.search = function() {
        if ($scope.active === true) {
            $scope.loading = true;
            eventService.broadcastEvent(constants.MAIN_QUERY_STARTED);
            searchService.query($scope.params)
                .then(function(data) { //success
                    $scope.loading = false;
                    eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, data);
                }, function() { //failure
                    $scope.loading = false;
                    eventService.broadcastEvent(constants.MAIN_QUERY_FAILURE);
                });
        }
    };

    var setDefaults = function() {
        $scope.active = false;
        $scope.loading = false;
        $scope.params = appState.getParams();
    };

    // LISTENERS
    var appStateListener = function() {
        $scope.params = appState.getParams();
        $scope.active = $scope.params.isValid();
    };

    var enterPressedListener = function() {
        $scope.active = $scope.params.isValid();
        $scope.search();
    };

    var initListeners = function() {
        eventService.on(appState.APP_STATE_CHANGED_EVT, appStateListener);
        eventService.on(constants.KEYWORD_ENTER_PRESSED, enterPressedListener);
        eventService.on(constants.MAP_VIEW_CHANGED, enterPressedListener);
        eventService.on(constants.FILTER_CHANGED_EVT, enterPressedListener);
    };

    // INITIALIZER
    var initialize = function() {
        setDefaults();
        initListeners();
    };

    initialize();
};
