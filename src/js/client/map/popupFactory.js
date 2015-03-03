'use strict';


var poiTemplate = require('templates/poiPopup.hbs');
var angular = require('../shims/angular');
var utils = require('../../common/utils');

module.exports = {
        getPopupHtml: function(feature) {
            var featureClone = angular.extend({}, feature);
            featureClone.properties.categories = utils.getArrayFromString(feature.properties.category);
            featureClone.properties.photos = utils.getArrayFromString(feature.properties.photo);
            return poiTemplate(featureClone.properties);
        }
};
