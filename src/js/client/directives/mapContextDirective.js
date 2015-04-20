'use strict';

var angular = require('../shims/angular');
var utils = require('../../common/utils');
var constants = require('../config/constants');
var types = require('../../model/types');
var Area = require('../../model/Area');
var AreaCircle = require('../../model/AreaCircle');

module.exports = function(eventService, appState) {
    var DEFAULT_RADIUS = 1;

    var link = function($scope) {
        $scope.searchHere = function() {
            var area = new AreaCircle(constants.CUSTOM_POINT, $scope.point, DEFAULT_RADIUS, Area.INTERACTIVE_TYPE);
            appState.setArea(area);
            eventService.broadcastEvent(constants.MAP_CONTEXT_CLOSE_EVT);
        };
    };

    return {
        replace: true,
        templateUrl: 'templates/mapContext.html',
        restrict: 'E',
        scope: {
            point: '=point'
        },
        link: link
    };
};
