'use strict';

var constants = require('client/config/constants');
var utils = require('../../common/utils');
var angular = require('../shims/angular');
var types = require('../../model/types');

module.exports = function($scope, appState, eventService, searchService) {

    $scope.isPaginable = function() {
        return $scope.lastSearchWasPaginable;
    };

    var getParamsForNextPage = function(params) {
        var page = params.page || 1;
        var paramsClone = angular.extend({}, params);
        paramsClone.page = page + 1;
        return paramsClone;
    };

    $scope.fetchNextPage = function() {
        if ($scope.lastSearchParams) {
            var nextPageParams = getParamsForNextPage($scope.lastSearchParams);
            eventService.broadcastEvent(constants.FETCH_NEXT_PAGE_STARTED);
            $scope.queryRunning = true;
            searchService.query(nextPageParams)
                .then(function(data) {
                    $scope.queryRunning = false;
                    $scope.lastSearchParams = nextPageParams;
                    if (data.rows === 0) {
                        $scope.reachedTheEnd = true;
                    } else {
                        eventService.broadcastEvent(constants.FETCH_NEXT_PAGE_SUCCESS, data);
                    }
                }, function() {
                    $scope.queryRunning = false;
                    eventService.broadcastEvent(constants.FETCH_NEXT_PAGE_FAILURE);
                });
        }
    };

    // DEFAULTS

    var initDefaults = function() {
        $scope.queryRunning = false;
        $scope.reachedTheEnd = false;
        $scope.lastSearchWasPaginable = false;
    };

    // LISTENERS

    var mainQueryStartedListener = function(event, params) {
        $scope.lastSearchParams = params;
        $scope.reachedTheEnd = false;
    };

    var mainQuerySuccessListener = function(event, data) {
        $scope.lastSearchWasPaginable = data.paginable || false;
    };

    var initListeners = function() {
        eventService.on(constants.MAIN_QUERY_SUCCESS, mainQuerySuccessListener);
        eventService.on(constants.MAIN_QUERY_STARTED, mainQueryStartedListener);
    };

    // INITIALIZER
    var initialize = function() {
        initDefaults();
        initListeners();
    };

    initialize();
};
