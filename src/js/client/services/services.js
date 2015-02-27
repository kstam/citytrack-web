'use strict';

var angular = require('../shims/angular');

var services = angular.module('citytrack.services', []);

services.factory('NgEventService', ['$rootScope', function($rootScope) {
    var NgEventService = require('./NgEventService');
    return new NgEventService($rootScope);
}]);

services.factory('AppState', ['NgEventService', function(eventService) {
    var AppState = require('./AppState');
    return new AppState(eventService);
}]);

services.factory('AreaService', function() {
    var AreaService = require('./TheAreaService');
    return new AreaService();
});

module.exports = services;
