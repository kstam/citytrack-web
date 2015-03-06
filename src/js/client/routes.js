'use strict';

module.exports = function($routeProvider) {
    $routeProvider
        .when('/citytrack', {
            templateUrl: 'templates/citytrack.html',
            controller: 'CitytrackMainController'
        })
        .otherwise({
            redirectTo: '/citytrack'
        });
};