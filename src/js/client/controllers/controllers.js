'use strict';

var angular = require('../shims/angular');
var services = require('../services/services');

var citytrackControllers = angular.module('citytrack.controllers', [services.name]);

citytrackControllers.controller('CitytrackMainController', ['$scope',
    function($scope) {
        require('./CitytrackMainController')($scope);
    }]);

citytrackControllers.controller('AreaSelectController', ['$scope', 'AreaService', 'AppState', 'NgEventService',
    function($scope, areaService, appState, eventService) {
        require('./AreaSelectController')($scope, areaService, appState, eventService);
    }]);

citytrackControllers.controller('MapController', ['$scope', 'AppState', 'NgEventService',
    function($scope, appState, eventService) {
        require('./MapController')($scope, appState, eventService);
    }]);

citytrackControllers.controller('KeywordController', ['$scope', 'AppState', 'NgEventService',
    function($scope, appState, eventService) {
        require('./KeywordController')($scope, appState, eventService);
    }]);


citytrackControllers.controller('SearchButtonController', ['$scope', 'AppState', 'NgEventService', 'PoiService',
    function($scope, appState, eventService, poiService) {
        require('./SearchButtonController')($scope, appState, eventService, poiService);
    }]);

module.exports = citytrackControllers;
