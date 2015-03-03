'use strict';


var poiTemplate = require('templates/poiPopup.hbs');
var angular = require('../shims/angular');
var utils = require('../../common/utils');

var NO_IMG_URL = 'img/no_image_available.jpg';

module.exports = {
        getPopupHtml: function(feature) {
            var featureClone = angular.extend({}, feature);
            featureClone.properties.categories = utils.getArrayFromString(feature.properties.category);
            featureClone.properties.photos = utils.getArrayFromString(feature.properties.photo);
            featureClone.properties.mainPhoto = featureClone.properties.photos[0] || NO_IMG_URL;
            return poiTemplate(featureClone.properties);
        }
};
