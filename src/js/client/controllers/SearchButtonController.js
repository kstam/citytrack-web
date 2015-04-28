'use strict';

var angular = require('../shims/angular');
var constants = require('../config/constants');
var types = require('../../model/types');

module.exports = function($scope, appState, eventService, searchService) {

    var resetCategoriesAndSourcesIfNecessary = function() {
        if ($scope.topLevelSearchChanged &&
            appState.getType() !== types.streetofinterest &&
                appState.getType() !== types.scenicstreets &&
                appState.getType() !== types.regionofinterest
        ) {
            appState.setCategories([]);
            appState.setSources([]);
            $scope.topLevelSearchChanged = false;
        }
    };

    $scope.search = function() {
        if ($scope.active === true) {
            resetCategoriesAndSourcesIfNecessary();
            eventService.broadcastEvent(constants.MAIN_QUERY_STARTED, $scope.params);
            searchService.query($scope.params)
                .then(function(data) { //success
                    eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, data);
                }, function() { //failure
                    eventService.broadcastEvent(constants.MAIN_QUERY_FAILURE);
                });
        }
    };

    var setDefaults = function() {
        $scope.active = false;
        $scope.loading = false;
        $scope.topLevelSearchChanged = false;
        $scope.params = appState.getParams();
    };

    // LISTENERS
    var mainQueryStartedListener = function() {
        $scope.loading = true;
    };

    var mainQueryFinishedListener = function() {
        $scope.loading = false;
    };

    var appStateListener = function() {
        $scope.params = appState.getParams();
        $scope.active = $scope.params.isValid();
    };

    var enterPressedListener = function() {
        $scope.active = $scope.params.isValid();
        $scope.search();
    };

    var topLevelSearchChangedListener = function() {
        $scope.topLevelSearchChanged = true;
    };

    var initListeners = function() {
        eventService.on(appState.APP_STATE_CHANGED_EVT, appStateListener);
        eventService.on(constants.KEYWORD_ENTER_PRESSED, enterPressedListener);
        eventService.on(constants.MAP_VIEW_CHANGED, enterPressedListener);
        eventService.on(constants.FILTER_CHANGED_EVT, enterPressedListener);

        eventService.on(constants.MAIN_QUERY_STARTED, mainQueryStartedListener);
        eventService.on(constants.MAIN_QUERY_FAILURE, mainQueryFinishedListener);
        eventService.on(constants.MAIN_QUERY_SUCCESS, mainQueryFinishedListener);

        eventService.on(appState.TYPE_CHANGED_EVT, topLevelSearchChangedListener);
        eventService.on(appState.AREA_CHANGED_EVT, topLevelSearchChangedListener);
        eventService.on(appState.KEYWORD_CHANGED_EVT, topLevelSearchChangedListener);
    };

    // INITIALIZER
    var initialize = function() {
        setDefaults();
        initListeners();
    };

    initialize();
};
