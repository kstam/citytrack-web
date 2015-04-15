'use strict';

require('jquery');
var angular = require('../shims/angular');
var services = require('../services/services');
require('../shims/angular-selectize2');
require('leaflet');
require('angular-leaflet-directive');
require('angular-sanitize');

var citytrackDirectives = angular.module('citytrack.directives', [services.name,
    'selectize', 'leaflet-directive', 'ngSanitize']);

citytrackDirectives.directive('resultRow', ['NgEventService', 'SearchService', function(eventService, searchService) {
    return require('./resultRowDirective')(eventService, searchService);
}]);

citytrackDirectives.directive('errSrc', function() {
    return require('./errSrcDirective');
});

citytrackDirectives.directive('facet', function() {
    return require('./facetDirective');
});

module.exports = citytrackDirectives;
