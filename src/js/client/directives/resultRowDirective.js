'use strict';

var angular = require('../shims/angular');
var utils = require('../../common/utils');
var constants = require('../config/constants');
var types = require('../../model/types');
var ParamsBuilder = require('../../model/Params').Builder;

module.exports = function(eventService, searchService) {

    var LOADING_ID = 'loading';

    var getExtraPhotos = function(photos) {
        var i, result = [];
        for (i = 1; i < photos.length; i++) {
            result.push(photos[i]);
        }
        return result;
    };

    var link = function($scope) {
        $scope.data = angular.copy($scope.row.properties);
        $scope.data.label = $scope.data.label || $scope.data.streetName;
        $scope.data.categories = utils.getArrayFromString($scope.data.category);
        $scope.data.photos = utils.getArrayFromString($scope.data.photo);
        $scope.data.mainPhoto = $scope.data.photos[0] || constants.NO_IMG_URL;
        $scope.data.extraPhotos = getExtraPhotos($scope.data.photos);
        $scope.data.description = $scope.data.description || 'No description available.';
        $scope.feature = angular.copy($scope.row);

        $scope.extras = {};

        $scope.formattedDensity = function() {
            return Number($scope.data.poiDensity).toFixed(2);
        };

        $scope.isStreet = function() {
            return $scope.data.type === types.streetofinterest.id;
        };

        $scope.isMap = function() {
            return $scope.data.target === constants.TARGET_MAP;
        };

        $scope.isResult = function() {
            return !$scope.isMap();
        };

        $scope.hasMorePhotos = function() {
            return ($scope.data.photos) && $scope.data.photos.length > 1;
        };

        $scope.resultSelected = function() {
            if ($scope.isStreet() && !$scope.extras.diversePhotos) {
                var params = new ParamsBuilder()
                    .withType(types.diversestreetphotos)
                    .withStreetId(Number($scope.data.id))
                    .build();
                $scope.extras.diversePhotos = LOADING_ID;
                searchService.query(params)
                    .then(function(response) {
                        $scope.extras.diversePhotos = response.collection.features;
                    }, function() {
                        $scope.extras.diversePhotos = [];
                    });
            }
        };

        var resultSelectedListener = function(event, id) {
            if ($scope.isMap() && $scope.data.id === id) {
                $scope.resultSelected();
            }
        };

        // LISTENERS
        if ($scope.isMap()) {
            eventService.on(constants.RESULTS_ROW_SELECTED, resultSelectedListener);
            eventService.on(constants.MAP_FEATURE_SELECTED, resultSelectedListener);

            $scope.$on('$destroy', function() {
                eventService.off(constants.RESULTS_ROW_SELECTED, resultSelectedListener);
                eventService.off(constants.MAP_FEATURE_SELECTED, resultSelectedListener);
            });
        }
    };

    return {
        replace: true,
        templateUrl: 'templates/resultRow.html',
        restrict: 'E',
        scope: {
            row: '=model'
        },
        link: link
    };
};
