'use strict';

var config = require('../config/leafletConfig');

module.exports = function($scope) {

    var setDefaults = function() {
        angular.extend($scope, config);
    };

    var initialize = function() {
        setDefaults();
    };

    initialize();
};
