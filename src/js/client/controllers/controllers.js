'use strict';

var angular = require('../shims/angular');
var services = require('../services/services');

var citytrackControllers = angular.module('citytrack.controllers', [services.name]);

citytrackControllers.controller('CitytrackMainController', ['$scope', function($scope) {
    require('./CitytrackMainController')($scope);
}]);

citytrackControllers.controller('AreaSelectController', ['$scope', 'AreaService', function($scope, areaService) {
    require('./AreaSelectController')($scope, areaService);
}]);

citytrackControllers.controller('MapController', ['$scope', function($scope) {
    require('./MapController')($scope);
}]);

module.exports = citytrackControllers;
