'use strict';

var angular = require('../shims/angular');
var utils = require('../../common/utils');
var constants = require('../config/constants');

var getExtraPhotos = function(photos) {
    var i, result = [];
    for (i=1; i < photos.length; i++) {
        result.push(photos[i]);
    }
    return result;
};

var link = function($scope) {
    $scope.data = angular.copy($scope.row.properties);
    $scope.data.categories = utils.getArrayFromString($scope.data.category);
    $scope.data.photos = utils.getArrayFromString($scope.data.photo);
    $scope.data.mainPhoto = $scope.data.photos[0] || constants.NO_IMG_URL;
    $scope.data.extraPhotos = getExtraPhotos($scope.data.photos);
    $scope.data.description = $scope.data.description || 'No description available.';

    $scope.isMap = function() {
        //console.log('comparing ' + $scope.data.target + '===' + constants.TARGET_MAP);
        return $scope.data.target === constants.TARGET_MAP;
    };

    $scope.isResult = function() {
        return !$scope.isMap();
    };

    $scope.hasMorePhotos = function() {
        return ($scope.data.photos) && $scope.data.photos.length > 1;
    }
};

module.exports = {
    replace: true,
    templateUrl: 'templates/resultRow.html',
    restrict: 'E',
    scope: {
        row: '=model'
    },
    link: link
};