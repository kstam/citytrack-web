'use strict';

var constants = require('client/config/constants');
var utils = require('../../common/utils');

module.exports = function($scope, appState, eventService) {

    var setDefaults = function() {
        $scope.rows = [];
        $scope.error = false;
    };

    // LISTENERS

    var mainSuccessListener = function(event, data) {
        $scope.error = false;
        $scope.rows = [];
        if (data && data.collection && utils.isArray(data.collection.features)) {
            $scope.rows = $scope.rows.concat(data.collection.features);
        }
    };

    var fetchNextPageSuccessListener = function(event, data) {
        if (data && data.collection && utils.isArray(data.collection.features)) {
            $scope.rows = $scope.rows.concat(data.collection.features);
        }
    };

    var mainErrorListener = function() {
        $scope.error = true;
        $scope.rows = [];
    };

    var initListeners = function() {
        eventService.on(constants.MAIN_QUERY_SUCCESS, mainSuccessListener);
        eventService.on(constants.MAIN_QUERY_FAILURE, mainErrorListener);
        eventService.on(constants.FETCH_NEXT_PAGE_SUCCESS, fetchNextPageSuccessListener);
    };

    // INITIALIZER
    var initialize = function() {
        setDefaults();
        initListeners();
    };

    initialize();
};
