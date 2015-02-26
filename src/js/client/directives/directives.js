'use strict';

require('jquery');
var angular = require('../shims/angular');
require('../shims/angular-selectize2');
require('leaflet');
require('angular-leaflet-directive');

var citytrackDirectives = angular.module('citytrack.directives', ['selectize', 'leaflet-directive']);
module.exports = citytrackDirectives;
