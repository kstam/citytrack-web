'use strict';

var angular = require('../shims/angular');
var constants = require('../config/constants');
var fields = require('../../model/fields');
var types = require('../../model/types');

module.exports = function($scope, appState, eventService, searchService) {

    $scope.getPoisForStreet = function(streetId) {
        if ($scope.loading === true) {
            return;
        }
        var params = appState.getParams();
        eventService.broadcastEvent(constants.MAIN_QUERY_STARTED, params);
        params.type = types.poisforstreet;
        params.streetId = Number(streetId);
        searchService.query(params).then(
            function(data) {
                eventService.broadcastEvent(constants.MAIN_QUERY_SUCCESS, data);
            }, function() {
                eventService.broadcastEvent(constants.MAIN_QUERY_FAILURE);
            }
        );
    };

    // LISTENERS
    var mainQueryStartedListener = function() {
        $scope.loading = true;
    };

    var mainQueryFinishedListener = function() {
        $scope.loading = false;
    };

    var initListeners = function() {
        eventService.on(constants.MAIN_QUERY_STARTED, mainQueryStartedListener);
        eventService.on(constants.MAIN_QUERY_FAILURE, mainQueryFinishedListener);
        eventService.on(constants.MAIN_QUERY_SUCCESS, mainQueryFinishedListener);
    };

    // INITIALIZER
    var setDefaults = function() {
        $scope.loading = false;
    };

    var initialize = function() {
        setDefaults();
        initListeners();
    };

    initialize();
};
