'use strict';
var angular = require('../shims/angular');
var types = require('../../model/types');
var utils = require('../../common/utils');

module.exports = function($scope, appState, eventService) {

    var DEFAULT_TYPE = types.poi;

    var getArrayOfSelectableTypes = function() {
        return Object.keys(types)
            .filter(function(key) {
                return types[key].selectable === true;
            })
            .map(function(key) {
                return types[key];
            });
    };

    var setDefaults = function() {
        $scope.types = getArrayOfSelectableTypes();
        $scope.selectedTypeId = DEFAULT_TYPE.id;
        $scope.selectedType = DEFAULT_TYPE;
        appState.setType(DEFAULT_TYPE);
    };

    var initConfig = function() {
        var renderIcon = function(item) {
            var icons = utils.isArray(item.iconClass) ? item.iconClass : [item.iconClass];
            var result = '<div class="type-entry"><span class="fa-stack">';
            icons.forEach(function(icon, idx) {
                var stackClass = icons.length > 1 ? 'fa-stack-' + (idx + 1) + 'x' : '';
                result += '<i class="fa ' + icon + ' ' + stackClass + '"></i>';
            });
            var text = item.caption;
            result += '</span>' + text + '</div>';
            return result;
        };
        $scope.config = {
            create: false,
            maxItems: 1,
            valueField: 'id',
            labelField: 'id',
            openOnFocus: true,
            readOnly: true,
            onDelete: function() {
                return false;
            },
            render: {
                item: renderIcon,
                option: renderIcon
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
