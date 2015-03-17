'use strict';

var utils = require('../../common/utils');
var Area = require('../../model/Area');
var types = require('../../model/types');

module.exports = function($resource) {

    var POI = $resource('api/pois', {}, {
        query: {
            method: 'GET',
            params: {}
        }
    });

    var Photo = $resource('api/photos', {}, {
        query: {
            method: 'GET',
            params: {}
        }
    });

    var Event = $resource('api/events', {}, {
        query: {
            method: 'GET',
            params: {}
        }
    });

    var StreetOfInterest = $resource('api/streets', {}, {
        query: {
            method: 'GET',
            params: {}
        }
    });

    var validateParams = function(params) {
        if(!params.isValid()) {
            throw new Error('Attempted to call the SearchService with invalid parameters');
        }
    };

    var generateParamsObject = function(params) {
        var p = {};

        p.box = params.area.getBoundingBoxAsList().join(',');
        p.cat = (params.categories && params.categories.length > 0) ? params.categories.join(',') : undefined;
        p.pg = params.page;
        p.pgsize = params.pageSize;

        switch (params.type.id) {
            case types.poi.id:
            case types.event.id:
            case types.photo.id:
                p.q = params.keyword;
                p.src = (params.sources && params.sources.length > 0) ? params.sources.join(',') : undefined;
                break;
            case types.streetofinterest.id:
                break;
            default:
                break;
        }

        return p;
    };

    var getResource = function(params) {
        switch (params.type.id) {
            case types.poi.id:
                return POI;
            case types.event.id:
                return Event;
            case types.photo.id:
                return Photo;
            case types.streetofinterest.id:
                return StreetOfInterest;
            default:
                break;
        }
    };

    var query = function(params) {
        validateParams(params);
        var apiParams = generateParamsObject(params);
        return getResource(params).query(apiParams).$promise;
    };

    return {
        query: query
    };
};
