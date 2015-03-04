'use strict';
var angular = require('../shims/angular');
var types = require('../../model/types');

module.exports = function($scope, appState, eventService) {

    var DEFAULT_TYPE = types.poi;

    var setDefaults = function() {
        $scope.types = Object.keys(types).map(function(key) {
            return types[key];
        });
        $scope.selectedTypeId = DEFAULT_TYPE.id;
        $scope.selectedType = DEFAULT_TYPE;
        appState.setType(DEFAULT_TYPE);
    };

    var initConfig = function() {
        $scope.config = {
            create: false,
            maxItems: 1,
            valueField: 'id',
            labelField: 'id',
            openOnFocus: true,
            readOnly: true,
            onDelete: function() { return false; },
            render: {
                item: function(item) {
                    return '<div><i class="fa '+ item.iconClass + '"></i></div>';
                },

                option: function(item) {
                    return '<div><i class="fa '+ item.iconClass + '"></i></div>';
                }
            }
        };
    };

    // WATCHERS
    var selectedTypeIdWatcher = function(newTypeId, oldTypeId) {
        if (!angular.equals(newTypeId, oldTypeId)) {
            $scope.selectedType = types[newTypeId];
            appState.setType($scope.selectedType);
        }
    };

    var initWatchers = function() {
        $scope.$watch('selectedTypeId', selectedTypeIdWatcher);
    };

    //LISTENERS

    var typeChangedListener = function(event, newType) {
        $scope.selectedType = newType;
        $scope.selectedTypeId = newType.id;
    };

    var initListeners = function() {
        eventService.on(appState.TYPE_CHANGED_EVT, typeChangedListener);
    };

    // INITIALIZER
    var initialize = function() {
        setDefaults();
        initConfig();
        initListeners();
        initWatchers();
    };

    initialize();

};
