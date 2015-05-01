'use strict';

require('jquery');
var angular = require('../shims/angular');
var services = require('../services/services');
require('../shims/angular-selectize2');
require('leaflet');
require('angular-leaflet-directive');
require('angular-sanitize');
require('jqcloud2');
require('angular-jqcloud');

var citytrackDirectives = angular.module('citytrack.directives', [services.name,
    'selectize', 'leaflet-directive', 'ngSanitize', 'angular-jqcloud']);

citytrackDirectives.directive('resultRow', ['NgEventService', 'SearchService', 'TagCloudService',
    function(eventService, searchService, tagCloudService) {
        return require('./resultRowDirective')(eventService, searchService, tagCloudService);
    }]);

citytrackDirectives.directive('mapContext', ['NgEventService', 'AppState', function(eventService, appState) {
    return require('./mapContextDirective')(eventService, appState);
}]);

citytrackDirectives.directive('errSrc', function() {
    return require('./errSrcDirective');
});

citytrackDirectives.directive('facet', function() {
    return require('./facetDirective');
});

module.exports = citytrackDirectives;
