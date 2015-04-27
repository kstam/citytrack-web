'use strict';

var angular = require('../shims/angular');
var services = require('../services/services');
var directives = require('../directives/directives');

var citytrackControllers = angular.module('citytrack.controllers', [services.name, directives.name]);

citytrackControllers.controller('CitytrackMainController', ['$scope', 'AppState', 'NgEventService',
    function($scope, appState, eventService) {
        require('./CitytrackMainController')($scope, appState, eventService);
    }]);

citytrackControllers.controller('AreaSelectController', ['$scope', 'AreaService', 'AppState', 'NgEventService',
    function($scope, areaService, appState, eventService) {
        require('./AreaSelectController')($scope, areaService, appState, eventService);
    }]);

citytrackControllers.controller('MapController', ['$scope', 'AppState', 'NgEventService', 'leafletData', '$compile',
    function($scope, appState, eventService, leafletData, $compile) {
        require('./MapController')($scope, appState, eventService, leafletData, $compile);
    }]);

citytrackControllers.controller('MinPoisController', ['$scope', 'AppState', 'NgEventService',
    function($scope, appState, eventService) {
        require('./MinPoisController')($scope, appState, eventService);
    }]);
citytrackControllers.controller('MaxDistanceController', ['$scope', 'AppState', 'NgEventService',
    function($scope, appState, eventService) {
        require('./MaxDistanceController')($scope, appState, eventService);
    }]);

citytrackControllers.controller('RadiusSelectController', ['$scope', 'AppState', 'NgEventService',
    function($scope, appState, eventService) {
        require('./RadiusSelectController')($scope, appState, eventService);
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

citytrackControllers.controller('FilterController', ['$scope', 'AppState', 'NgEventService',
    function($scope, appState, eventService) {
        require('./FilterController')($scope, appState, eventService);
    }]);

citytrackControllers.controller('CategorySelectController', ['$scope', 'CategoryService', 'AppState', 'NgEventService',
    function($scope, categoryService, appState, eventService) {
        require('./CategorySelectController')($scope, categoryService, appState, eventService);
    }]);

citytrackControllers.controller('ResultActionController', ['$scope', 'AppState', 'NgEventService', 'SearchService',
    function($scope, appState, eventService, searchService) {
        require('./ResultActionController')($scope, appState, eventService, searchService);
    }]);

citytrackControllers.controller('ParametersPopupController', ['$scope',
    function($scope) {
        require('./ParametersPopupController')($scope);
    }]);

module.exports = citytrackControllers;
