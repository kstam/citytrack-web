'use strict';

module.exports = function($scope) {

    var initConfig = function() {
        $scope.config = {
            placeholder: 'Where...'
        };
    };

    var initialize = function() {
        $scope.areas = [];
        initConfig();
    };

    initialize();
};
