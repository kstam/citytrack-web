'use strict';

var angular = require('../shims/angular');
var Area = require('../../model/Area');
var constants = require('../config/constants');
var types = require('../../model/types');

module.exports = function($scope, categoryService, appState, eventService) {

    $scope.shouldShow = function() {
        var type = appState.getType();
        return type === types.streetofinterest ||
            type === types.regionofinterest;
    };

    var initDefaults = function() {
    };

    var initConfig = function() {
        $scope.config = {
            create: false,
            maxItems: 1,
            valueField: 'name',
            labelField: 'name',
            searchField: 'name',
            openOnFocus: true,
            placeholder: 'Category...'
        };
    };

    var initCategories = function() {
        $scope.categories = [];
        categoryService.getCategories()
            .then(function(data) {
                data.forEach(function(category) {
                    $scope.categories.push({name: category});
                });
            }, function() {
            });
    };

    // WATCHERS

    var selectedCategoryWatcher = function(current, old) {
        if (angular.equals(current, old)) {
            return;
        }
        if (!current) {
            appState.setCategories([]);
        } else {
            appState.setCategories([current]);
        }
    };

    var initWatchers = function() {
        $scope.$watch('selectedCategory', selectedCategoryWatcher);
    };

    // EVENT LISTENERS

    var categoryChangedListener = function() {
        if (appState.getCategories() && appState.getCategories().length === 1) {
            $scope.selectedCategory = appState.getCategories()[0];
        } else if (appState.getCategories() && appState.getCategories().length === 0) {
            $scope.selectedCategory = undefined;
        }
    };

    var initListeners = function() {
        eventService.on(appState.CATEGORIES_CHANGED_EVT, categoryChangedListener);
    };

    var initialize = function() {
        initDefaults();
        initConfig();
        initCategories();
        initWatchers();
        initListeners();
    };

    initialize();
};
