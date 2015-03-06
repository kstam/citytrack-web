'use strict';

var constants = require('client/config/constants');
var utils = require('../../common/utils');

module.exports = function($scope, appState, eventService) {

    $scope.selectRow = function(id) {
        $scope.selectedRow = id;
        eventService.broadcastEvent(constants.RESULTS_ROW_SELECTED, id);
    };

    $scope.isRowSelected = function(id) {
        return $scope.selectedRow === id;
    };

    var setDefaults = function() {
        $scope.rows = [];
        $scope.error = false;
    };

    // LISTENERS

    var mapPointSelectedListener = function(event, pointId) {
        $scope.selectedRow = pointId;
    };

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
        eventService.on(constants.MAP_POINT_SELECTED, mapPointSelectedListener);
    };

    // INITIALIZER
    var initialize = function() {
        setDefaults();
        initListeners();
    };

    initialize();
};
