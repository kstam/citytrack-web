'use strict';

var angular = require('../shims/angular');
var services = require('../services/services');
var directives = require('../directives/directives');

var citytrackControllers = angular.module('citytrack.controllers', [services.name, directives.name]);

citytrackControllers.controller('CitytrackMainController', ['$scope', 'NgEventService',
    function($scope, eventService) {
        require('./CitytrackMainController')($scope, eventService);
    }]);

citytrackControllers.controller('AreaSelectController', ['$scope', 'AreaService', 'AppState', 'NgEventService',
    function($scope, areaService, appState, eventService) {
        require('./AreaSelectController')($scope, areaService, appState, eventService);
    }]);

citytrackControllers.controller('MapController', ['$scope', 'AppState', 'NgEventService', 'leafletData', '$compile',
    function($scope, appState, eventService, leafletData, $compile) {
        require('./MapController')($scope, appState, eventService, leafletData, $compile);
    }]);

citytrackControllers.controller('KeywordController', ['$scope', 'AppState', 'NgEventService',
    function($scope, appState, eventService) {
        require('./KeywordController')($scope, appState, eventService);
    }]);

citytrackControllers.controller('SearchButtonController', ['$scope', 'AppState', 'NgEventService', 'SearchService',
    function($scope, appState, eventService, searchService) {
        require('./SearchButtonController')($scope, appState, eventService, searchService);
    }]);

citytrackControllers.controller('ResultsController', ['$scope', 'AppState', 'NgEventService',
    function($scope, appState, eventService) {
        require('./ResultsController')($scope, appState, eventService);
    }]);

citytrackControllers.controller('ResultsPaginationController', ['$scope', 'AppState', 'NgEventService', 'SearchService',
    function($scope, appState, eventService, searchService) {
        require('./ResultsPaginationController')($scope, appState, eventService, searchService);
    }]);

citytrackControllers.controller('TypeSelectController', ['$scope', 'AppState', 'NgEventService',
    function($scope, appState, eventService) {
        require('./TypeSelectController')($scope, appState, eventService);
    }]);

module.exports = citytrackControllers;
