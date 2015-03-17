'use strict';

var $ = require('jquery');
var Area = require('model/Area');
var utils = require('common/utils');
var constants = require('client/config/constants');
var latLngBounds = require('leaflet').latLngBounds;
var latLng = require('leaflet').latLng;

var CategoryService = function($resource) {

    var Categories = $resource('api/categories', {}, {
        query: {
            method: 'GET',
            params: {},
            isArray: true
        }
    });

    var getCategories = function() {
        return Categories.query().$promise;
    };

    return {
        getCategories: getCategories
    };
};

module.exports = CategoryService;
