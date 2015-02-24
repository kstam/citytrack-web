'use strict';

var angular = require('../shims/angular');

var citytrackControllers = angular.module('citytrack.controllers', []);

citytrackControllers.controller('CitytrackMainController', ['$scope', function($scope) {
    require('./CitytrackMainController')($scope);
}]);

citytrackControllers.controller('AreaSelectController', ['$scope', function($scope) {
    require('./AreaSelectController')($scope);
}]);

module.exports = citytrackControllers;
