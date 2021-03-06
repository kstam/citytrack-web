'use strict';

require('es5-shim');
require('jquery');
var angular = require('./shims/angular');
require('angular-route');
require('../../../build/templates'); //loads the html templates to the cache

var citytrackApp = angular.module('citytrack', [
    'ngRoute',
    'templates',
    require('./controllers/controllers').name,
    require('./directives/directives').name
]);

citytrackApp.config(['$routeProvider', require('./routes')]);
