'use strict';

var angular = require('../shims/angular');
var constants = require('client/config/constants');
var fields = require('../../model/fields');
var types = require('../../model/types');

module.exports = function($scope, appState, eventService) {
    var APP_STATE_ORIGIN = 'appState';
    var POPUP_ORIGIN = 'popup';

    var filterChangeOrigin = POPUP_ORIGIN;

    // LISTENERS
    var mainSuccessListener = function(event, data) {
        $scope.facets = data.facets || $scope.facets;
    };

    var categoriesChangedListener = function(event, newCategories) {
        $scope.selectedFacets[fields.CATEGORY_ID] = newCategories;
        filterChangeOrigin = APP_STATE_ORIGIN;
    };

    var sourcesChangedListener = function(event, newSources) {
        $scope.selectedFacets[fields.SOURCE_ID] = newSources;
        filterChangeOrigin = APP_STATE_ORIGIN;
    };

    var initListeners = function() {
        eventService.on(constants.MAIN_QUERY_SUCCESS, mainSuccessListener);
        eventService.on(appState.CATEGORIES_CHANGED_EVT, categoriesChangedListener);
        eventService.on(appState.SOURCES_CHANGED_EVT, sourcesChangedListener);
    };

    // WATCHERS
    var selectedFacetsWatcher = function(nSelFacets, oSelFacets) {
        if(!angular.equals(nSelFacets, oSelFacets)) {
            var shouldFireEvent = filterChangeOrigin === POPUP_ORIGIN;
            if (nSelFacets[fields.CATEGORY_ID]) {
                appState.setCategories(nSelFacets[fields.CATEGORY_ID]);
            }
            if (nSelFacets[fields.SOURCE_ID]) {
                appState.setSources(nSelFacets[fields.SOURCE_ID]);
            }
            if (shouldFireEvent) {
                eventService.broadcastEvent(constants.FILTER_CHANGED_EVT);
            }
            filterChangeOrigin = POPUP_ORIGIN;
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
