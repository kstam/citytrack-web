'use strict';

module.exports = function($routeProvider) {
    $routeProvider
        .when('/citytrack', {
            templateUrl: 'partials/citytrack.html',
            controller: 'CitytrackMainController'
        })
        .otherwise({
            redirectTo: '/citytrack'
        });
};