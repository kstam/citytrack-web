'use strict';

require('jquery');
var angular = require('../shims/angular');
require('../shims/angular-selectize2');
require('leaflet');
require('angular-leaflet-directive');
require('angular-sanitize');
var resultRowDirective = require('./resultRowDirective');

var citytrackDirectives = angular.module('citytrack.directives', ['selectize', 'leaflet-directive', 'ngSanitize']);

citytrackDirectives.directive('resultRow', function() {
    return resultRowDirective;
});

module.exports = citytrackDirectives;
