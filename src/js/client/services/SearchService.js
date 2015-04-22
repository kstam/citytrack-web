'use strict';

var utils = require('../../common/utils');
var Area = require('../../model/Area');
var AreaBox = require('../../model/AreaBox');
var AreaCircle = require('../../model/AreaCircle');
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

    var ScenicStreets = $resource('api/scenicStreets', {}, {
        query: {
            method: 'GET',
            params: {}
        }
    });

    var PoisForStreet = $resource('api/streets/:streetId/pois', {streetId: '@id'}, {
        query: {
            method: 'GET',
            params: {}
        }
    });

    var PhotosForStreet = $resource('api/streets/:streetId/photos', {streetId: '@id'}, {
        query: {
            method: 'GET',
            params: {}
        }
    });

    var DiverseStreetPhotos = $resource('api/streets/:streetId/diversePhotos', {streetId: '@id'}, {
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

    var setAreaAsBox = function(p, area) {
        p.box = area.getBoundingBoxAsList().join(',');
    };

    var setAreaInRequest = function(p, area) {
        if (area instanceof AreaBox) {
            p.box = area.getBoundingBoxAsList().join(',');
        } else if (area instanceof AreaCircle) {
            p.pt = area.getCenterAsList().join(',');
            p.r = area.getRadius();
        } else {
            throw new Error(area + ' is not a supported Area type');
        }
    };

    var generateParamsObject = function(params) {
        var p = {};

        p.cat = (params.categories && params.categories.length > 0) ? params.categories.join(',') : undefined;
        p.pg = params.page;
        p.pgsize = params.pageSize;

        switch (params.type.id) {
            case types.poi.id:
            case types.event.id:
            case types.photo.id:
                p.q = params.keyword;
                p.src = (params.sources && params.sources.length > 0) ? params.sources.join(',') : undefined;
                setAreaInRequest(p, params.area);
                break;
            case types.streetofinterest.id:
            case types.scenicstreets.id:
                setAreaAsBox(p, params.area);
                break;
            case types.poisforstreet.id:
            case types.diversestreetphotos.id:
            case types.photosforstreet.id:
                p.streetId = params.streetId;
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
            case types.scenicstreets.id:
                return ScenicStreets;
            case types.poisforstreet.id:
                return PoisForStreet;
            case types.diversestreetphotos.id:
                return DiverseStreetPhotos;
            case types.photosforstreet.id:
                return PhotosForStreet;
            default:
                throw new Error(params.type.id + ' is not supported by the SearchService');
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
