'use strict';

var angular = require('../shims/angular');
var utils = require('../../common/utils');
var cUtils = require('../common/client-utils');

var constants = require('../config/constants');
var types = require('../../model/types');
var ParamsBuilder = require('../../model/Params').Builder;
var Area = require('../../model/Area.js');
var AreaPolygon = require('../../model/AreaPolygon.js');

module.exports = function(eventService, searchService, tagCloudService) {

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

        $scope.isRegion = function() {
            return $scope.data.type === types.regionofinterest.id;
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

        var getDiversePhotoParams = function() {
            if ($scope.isStreet()) {
                return new ParamsBuilder()
                    .withType(types.diversestreetphotos)
                    .withStreetId(Number($scope.data.id))
                    .build();
            } else if ($scope.isRegion()) {
                var area = new AreaPolygon("custom", cUtils.extractPolygon($scope.feature), Area.INTERACTIVE_TYPE);
                return new ParamsBuilder()
                    .withType(types.diverseregionphotos)
                    .withArea(area)
                    .build();
            }
        };

        var diversePhotos = function() {
            if (($scope.isStreet() || $scope.isRegion()) && !$scope.extras.diversePhotos) {
                var params = getDiversePhotoParams();
                $scope.extras.diversePhotos = LOADING_ID;
                searchService.query(params)
                    .then(function(response) {
                        $scope.extras.diversePhotos = response.collection.features;
                    }, function() {
                        $scope.extras.diversePhotos = [];
                    });
            }
        };

        var tagCloud = function() {
            if ($scope.isStreet() && !$scope.extras.tagCloud) {
                $scope.extras.tagCloud = LOADING_ID;
                tagCloudService.getStreetTagCloud(Number($scope.data.id))
                    .then(function(result) {
                        $scope.extras.tagCloud = result;
                    });
            }
            if ($scope.isRegion() && !$scope.extras.tagCloud) {
                $scope.extras.tagCloud = LOADING_ID;
                var area = new AreaPolygon("custom", cUtils.extractPolygon($scope.feature), Area.INTERACTIVE_TYPE);
                tagCloudService.getRegionTagCloud(area)
                    .then(function(result) {
                        $scope.extras.tagCloud = result;
                    }, function() {
                        $scope.extras.tagCloud = {words: [], levels: 0};
                    });
            }
        };

        $scope.resultSelected = function() {
            diversePhotos();
            tagCloud();
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
