'use strict';

var angular = require('../shims/angular');
var constants = require('../config/constants');
var types = require('../../model/types');

module.exports = function($scope, appState, eventService) {

    $scope.shouldHide = function() {
        var type = appState.getType();
        return type === types.scenicstreets ||
                type === types.streetofinterest;
    };

    var setDefaults = function() {
        $scope.keyword = appState.getKeyword();
    };

    // WATCHERS
    var keywordWatcher = function(newKeyword, oldKeyword) {
        if (!angular.equals(newKeyword, oldKeyword)) {
            appState.setKeyword(newKeyword);
        }
    };

    var initWatchers = function() {
        $scope.$watch('keyword', keywordWatcher);
    };

    // LISTENERS

    var keywordListener = function(event, newKeyword) {
        $scope.keyword = newKeyword;
    };

    var initListeners = function() {
        eventService.on(appState.KEYWORD_CHANGED_EVT, keywordListener);
    };

    // INITIALIZER
    var initialize = function() {
        setDefaults();
        initWatchers();
        initListeners();
    };

    initialize();
};
