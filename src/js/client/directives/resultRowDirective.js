'use strict';

var angular = require('../shims/angular');
var utils = require('../../common/utils');
var constants = require('../config/constants');

var link = function ($scope) {
    $scope.data = angular.extend({}, $scope.row.properties);
    $scope.data.categories = utils.getArrayFromString($scope.data.category);
    $scope.data.photos = utils.getArrayFromString($scope.data.photo);
    $scope.data.mainPhoto = $scope.data.photos[0] || constants.NO_IMG_URL;
    $scope.data.description = $scope.data.description || 'No description available.';
};

module.exports = {
    replace: true,
    templateUrl: 'partials/resultRow.html',
    restrict: 'E',
    scope: {
        row: '=model'
    },
    link: link
};