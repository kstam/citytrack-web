'use strict';

require('jquery');
var angular = require('../shims/angular');
require('../shims/angular-selectize2');
require('leaflet');
require('angular-leaflet-directive');
var resultRowDirective = require('./resultRowDirective');

var citytrackDirectives = angular.module('citytrack.directives', ['selectize', 'leaflet-directive']);

citytrackDirectives.directive('resultRow', function() {
    return resultRowDirective;
});

module.exports = citytrackDirectives;
