'use strict';

var angular = require('../shims/angular');
var constants = require('client/config/constants');
var fields = require('../../model/fields');
var types = require('../../model/types');

module.exports = function($scope, appState, eventService) {

    // LISTENERS
    var mainSuccessListener = function(event, data) {
        $scope.facets = data.facets || $scope.facets;
    };

    var categoriesChangedListener = function(event, newCategories) {
        $scope.selectedFacets[fields.CATEGORY_ID] = newCategories;
    };

    var sourcesChangedListener = function(event, newSources) {
        $scope.selectedFacets[fields.SOURCE_ID] = newSources;
    };

    var initListeners = function() {
        eventService.on(constants.MAIN_QUERY_SUCCESS, mainSuccessListener);
        eventService.on(appState.CATEGORIES_CHANGED_EVT, categoriesChangedListener);
        eventService.on(appState.SOURCES_CHANGED_EVT, sourcesChangedListener);
    };

    // WATCHERS
    var selectedFacetsWatcher = function(nSelFacets, oSelFacets) {
        if(!angular.equals(nSelFacets, oSelFacets)) {
            if (nSelFacets[fields.CATEGORY_ID]) {
                appState.setCategories(nSelFacets[fields.CATEGORY_ID]);
            }
            if (nSelFacets[fields.SOURCE_ID]) {
                appState.setSources(nSelFacets[fields.SOURCE_ID]);
            }
            if (appState.getType() !== types.streetofinterest) {
                eventService.broadcastEvent(constants.FILTER_CHANGED_EVT);
            }
        }
    };

    var initWatchers = function() {
        $scope.$watch('selectedFacets', selectedFacetsWatcher, true);
    };

    // INITIALIZER
    var setDefaults = function() {
        $scope.selectedFacets = {};
        $scope.facets = {};
    };

    var initialize = function() {
        setDefaults();
        initListeners();
        initWatchers();
    };

    initialize();
};
