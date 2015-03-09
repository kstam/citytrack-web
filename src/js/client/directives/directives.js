'use strict';

require('jquery');
var angular = require('../shims/angular');
require('../shims/angular-selectize2');
require('leaflet');
require('angular-leaflet-directive');
require('angular-sanitize');

var citytrackDirectives = angular.module('citytrack.directives', ['selectize', 'leaflet-directive', 'ngSanitize']);

citytrackDirectives.directive('resultRow', function() {
    return require('./resultRowDirective');
});

citytrackDirectives.directive('errSrc', function() {
    return require('./errSrcDirective');
});

citytrackDirectives.directive('facet', function() {
    return require('./facetDirective');
});

module.exports = citytrackDirectives;
