'use strict';

require('es5-shim');
require('jquery');
var angular = require('./shims/angular');
require('angular-route');

var citytrackApp = angular.module('citytrack', [
    'ngRoute',
    require('./controllers/controllers').name,
    require('./directives/directives').name
]);

citytrackApp.config(['$routeProvider', require('./routes')]);
