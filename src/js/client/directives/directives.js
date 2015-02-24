'use strict';

require('jquery');
var angular = require('../shims/angular');
require('../shims/angular-selectize2');

var citytrackDirectives = angular.module('citytrack.directives', ['selectize']);
module.exports = citytrackDirectives;
