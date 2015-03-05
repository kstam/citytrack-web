'use strict';

var utils = require('../../common/utils');
var Area = require('../../model/Area');

module.exports = function($resource) {

    var POI = $resource('api/pois', {}, {
        getPois: {
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
        p.q = params.keyword;
        p.box = params.area.getBoundingBoxAsList().join(',');
        p.pg = params.page;
        p.pgsize = params.pageSize;
        p.src = params.sources ? params.sources.join(',') : undefined;
        p.cat = params.categories ? params.categories.join(',') : undefined;
        return p;
    };

    var query = function(params) {
        validateParams(params);
        var apiParams = generateParamsObject(params);
        return POI.getPois(apiParams).$promise;
    };

    return {
        query: query
    };
};
