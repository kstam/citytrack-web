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
        if (!(utils.isString(params.keyword) && params.keyword !== '')) {
            throw new Error('[' + params.keyword + '] is not a valid keyword');
        }
        if (!(params.area instanceof Area)) {
            throw new Error('[' + params.area + '] is not a valid area');
        }

        if (!utils.optional(params.page)(utils.isInteger)) {
            throw new Error('[' + params.page + '] is not a valid page');
        }

        if (!utils.optional(params.pageSize)(utils.isInteger)) {
            throw new Error('[' + params.pageSize + '] is not a valid pageSize');
        }

        if (!utils.optional(params.sources)(utils.isArray)) {
            throw new Error('[' + params.sources + '] is not a valid sources list');
        }

        if (!utils.optional(params.categories)(utils.isArray)) {
            throw new Error('[' + params.categories + '] is not a valid sources list');
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

    var getPois = function(params) {
        validateParams(params);
        var apiParams = generateParamsObject(params);
        return POI.getPois(apiParams).$promise;
    };

    return {
        getPois: getPois
    };
};
