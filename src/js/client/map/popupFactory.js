'use strict';

var $ = require('jquery');
var angular = require('../shims/angular');
var utils = require('../../common/utils');
var constants = require('../config/constants');

var popupHtml = '<result-row model="row"></result-row>';
var contextHtml = '<map-context point="point"></map-context>';

module.exports = {
        getPopupElement: function(feature, $compile, $parentScope) {
            var scope = $parentScope.$new();
            scope.row = angular.copy(feature);
            scope.row.properties.target = 'map';
            var element = $compile(popupHtml)(scope);
            element.destroy = function() {
                scope.$broadcast('$destroy');
            };
            return element;
        },
        getContextPopup: function(point, $compile, $parentScope) {
            var scope = $parentScope.$new();
            scope.point = point;
            var element = $compile(contextHtml)(scope);
            element.destroy = function() {
                scope.$broadcast('$destroy');
            };
            return element;
        }
};
