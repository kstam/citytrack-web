'use strict';

var $ = require('jquery');
var angular = require('../shims/angular');
var utils = require('../../common/utils');
var constants = require('../config/constants');

var popupHtml = '<result-row model="row"></result-row>';

module.exports = {
        getPopupElement: function(feature, $compile, $parentScope) {
            var scope = $parentScope.$new();
            scope.row = angular.copy(feature);
            scope.row.properties.target = 'map';
            return $compile(popupHtml)(scope);
        }
};
