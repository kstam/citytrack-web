'use strict';

var angular = require('../shims/angular');

module.exports = function($scope, areaService) {

    var initConfig = function() {
        $scope.config = {
            create: false,
            maxItems: 1,
            valueField: 'name',
            labelField: 'name',
            openOnFocus: true,
            placeholder: 'Where...'
        };
    };

    var initAreas = function() {
        $scope.areaMap = {};
        $scope.areas = [];
        areaService.getAreas(function(err, areas) {
            if (err instanceof Error) {
                //TODO
                return;
            }
            $scope.$apply(function() {
                angular.forEach(areas, function(value) {
                    $scope.areaMap[value.getName()] = value;
                });
            });
        });
    };

    var initCurrentArea = function() {
        areaService.getCurrentArea(function(err, currentArea) {
            if (err instanceof Error) {
                //TODO;
                return;
            }
            $scope.$apply(function() {
                $scope.areaMap[currentArea.getName()] = currentArea;
                $scope.currentArea = currentArea;
            });
        });
    };

    $scope.$watch('areaMap', function(current, old) {
        if (angular.equals(current, old)) {
            return;
        }
        $scope.areas = [];
        angular.forEach(current, function(value) {
            $scope.areas.push(value);
        });
    }, true);

    $scope.$watch('selectedAreaId', function(current, old) {
        if (angular.equals(current, old)) {
            return;
        }
        $scope.selectedArea = $scope.areaMap[current];
    });

    var initialize = function() {
        initConfig();
        initAreas();
        initCurrentArea();
    };

    initialize();
};
