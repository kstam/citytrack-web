'use strict';

var $ = require('jquery');
var angular = require('../shims/angular');
var utils = require('../../common/utils');
var constants = require('../config/constants');
var fields = require('../../model/fields');

var arrayToMap = function(array) {
    var result = {};
    array.forEach(function(element) {
        result[element] = true;
    });
    return result;
};

var mapToArray = function(map) {
    return Object.keys(map);
};

var link = function($scope, element) {
    var $element = $(element);
    var $popupElem = $element.find('.filter-popup');
    var $popupGreyout = $element.find('.popup-grey-out');
    var $popupButton = $element.find('.filter-button');

    $scope.isSelected = function(id) {
        return $scope.modelMap[id] === true;
    };

    $scope.toggle = function(id) {
        if ($scope.isSelected(id)) {
            delete $scope.modelMap[id];
        } else {
            $scope.modelMap[id] = true;
        }
    };

    $scope.showPopup = function() {
        positionPopup();
        $popupElem.show();
        $popupGreyout.show();
    };

    $scope.hidePopup = function() {
        $popupElem.hide();
        $popupGreyout.hide();
    };

    $scope.ok = function() {
        $scope.hidePopup();
        $scope.model = $scope.modelArray;
    };

    $scope.cancel = function() {
        initDefaults();
        $scope.hidePopup();
    };

    $scope.getFieldLabel = function() {
        var field = fields[$scope.facetField];
        return (field && field.userFriendly) ?
            utils.capitalizeWords(field.userFriendly) : $scope.facetField;
    };

    var initDefaults = function() {
        $scope.modelArray = $scope.model ? angular.copy($scope.model) : [];
        $scope.modelMap = arrayToMap($scope.modelArray);
    };

    var modelArrayWatcher = function(newV, oldV) {
        if (angular.equals(newV, oldV)) {
            return;
        }
        var newMap = arrayToMap($scope.modelArray);
        if (!angular.equals(newMap, $scope.modelMap)) {
            $scope.modelMap = newMap;
        }
    };

    var modelMapWatcher = function(newV, oldV) {
        if (angular.equals(newV, oldV)) {
            return;
        }
        var newArray = mapToArray($scope.modelMap);
        if (!angular.equals(newArray, $scope.modelArray)) {
            $scope.modelArray = newArray;
        }
    };

    var modelWatcher = function(newModel, oldModel) {
        if (!newModel || angular.equals(newModel, oldModel)) {
            return;
        }
        $scope.modelArray = angular.copy(newModel);
    };

    var initWatchers = function() {
        $scope.$watch('modelArray', modelArrayWatcher, true);
        $scope.$watch('modelMap', modelMapWatcher, true);
        $scope.$watch('model', modelWatcher, true);
    };

    var hidePopup = function() {
        $popupElem.hide();
        $popupGreyout.hide();
    };

    var positionPopup = function() {
        var buttonPos = $popupButton.offset();
        var buttonHeight = $popupButton.outerHeight();

        $popupElem.css('position', 'absolute');
        $popupElem.css('top', buttonPos.top + buttonHeight + 10 + 'px');
        $popupElem.css('left', buttonPos.left + 'px');
    };

    var initialize = function() {
        initDefaults();
        initWatchers();
        hidePopup();
    };

    initialize();
};

module.exports = {
    replace: true,
    templateUrl: 'templates/facetDirective.html',
    restrict: 'E',
    scope: {
        facetList: '=facetList',
        model: '=model',
        facetField: '=facetField'
    },
    link: link
};
