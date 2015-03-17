'use strict';

var angular = require('../shims/angular');
require('angular-resource');

var services = angular.module('citytrack.services', ['ngResource']);

services.factory('NgEventService', ['$rootScope', function($rootScope) {
    var NgEventService = require('./NgEventService');
    return new NgEventService($rootScope);
}]);

services.factory('AppState', ['NgEventService', function(eventService) {
    var AppState = require('./AppState');
    return new AppState(eventService);
}]);

services.factory('AreaService', function() {
    var AreaService = require('./AreaService');
    return new AreaService();
});

services.factory('SearchService', ['$resource', function($resource) {
    var SearchService = require('./SearchService');
    return new SearchService($resource);
}]);

services.factory('CategoryService', ['$resource', function($resource) {
    var CategoryService = require('./CategoryService');
    return new CategoryService($resource);
}]);


module.exports = services;
