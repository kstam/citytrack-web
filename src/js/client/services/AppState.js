'use strict';

var utils = require('common/utils');
var Area = require('model/Area');
var Params = require('model/Params');

var APP_STATE_CHANGED_EVT = 'AppState:Changed';
var AREA_CHANGED_EVT = 'AppState:AreaChanged';
var KEYWORD_CHANGED_EVT = 'AppState:KeywordChanged';
var TYPE_CHANGED_EVT = 'AppState:TypeChanged';
var CATEGORIES_CHANGED_EVT = 'AppState:CategoriesChanged';
var SOURCES_CHANGED_EVT = 'AppState:SourcesChanged';
var MIN_POIS_CHANGED_EVT = 'AppState:MinPoisChanged';
var MAX_DISTANCE_CHANGED_EVT = 'AppState:MaxDistanceChanged';

var AppState = function(eventBus) {

    var area, type,
        keyword = '',
        categories = [],
        sources = [],
        minPois = 5,
        maxDistance = 50;

    var fireChangeEvent = function(eventName) {
        var args = Array.prototype.splice.call(arguments, 0);
        eventBus.broadcastEvent.apply(eventBus, args);
        args[0] = APP_STATE_CHANGED_EVT;
        eventBus.broadcastEvent.apply(eventBus, args);
    };

    var isValidArea = function(area) {
        return (typeof area === 'undefined') || (area instanceof Area);
    };

    var isValidType = function(type) {
        return type && type.id && type.iconClass;
    };

    var isValidStringArray = function(categories) {
        return utils.isArray(categories) && categories.reduce(function(result, value) {
                return result && utils.isString(value);
            }, true);
    };

    var setArea = function(newArea) {
        if (!utils.optional(newArea)(isValidArea)) {
            throw new Error('[' + newArea + '] is not a valid Area');
        }

        var areaChanged = ((typeof newArea === 'undefined') && (newArea !== area)) ||
            ((newArea instanceof Area) && (!newArea.equals(area)));

        if (areaChanged) {
            area = newArea;
            fireChangeEvent(AREA_CHANGED_EVT, newArea);
        }
    };

    var setKeyword = function(newKeyword) {
        if (!utils.isString(newKeyword)) {
            throw new Error('[' + newKeyword + '] is not a valid keyword');
        }
        if (newKeyword !== keyword) {
            keyword = newKeyword;
            fireChangeEvent(KEYWORD_CHANGED_EVT, newKeyword);
        }
    };

    var setType = function(newType) {
        if(!isValidType(newType)) {
            throw new Error('[' + newType + '] is not a valid type');
        }
        if (!type || newType.id !== type.id) {
            type = newType;
            fireChangeEvent(TYPE_CHANGED_EVT, newType);
        }
    };

    var setCategories = function(newCategories) {
        if(!isValidStringArray(newCategories)) {
            throw new Error('[' + newCategories + '] is not a valid categories array');
        }
        if(!utils.sameContent(newCategories, categories)) {
            categories = newCategories;
            fireChangeEvent(CATEGORIES_CHANGED_EVT, newCategories);
        }
    };

    var setSources = function(newSources) {
        if(!isValidStringArray(newSources)) {
            throw new Error('[' + newSources + '] is not a valid sources array');
        }
        if(!utils.sameContent(newSources, sources)) {
            sources = newSources;
            fireChangeEvent(SOURCES_CHANGED_EVT, newSources);
        }
    };

    var setMinPois = function(newMinPois) {
        if(!utils.isInteger(newMinPois) || newMinPois <= 0) {
            throw new Error('[' + newMinPois + '] is not a valid minPois value');
        }
        if (minPois !== newMinPois) {
            minPois = newMinPois;
            fireChangeEvent(MIN_POIS_CHANGED_EVT, minPois);
        }
    };

    var setMaxDistance = function(newMaxDistance) {
        if(!utils.isInteger(newMaxDistance) || newMaxDistance <= 0) {
            throw new Error('[' + newMaxDistance + '] is not a valid maxDistance value');
        }
        if (maxDistance !== newMaxDistance) {
            maxDistance = newMaxDistance;
            fireChangeEvent(MAX_DISTANCE_CHANGED_EVT, maxDistance);
        }
    };

    var getType = function() {
        return type;
    };

    var getArea = function() {
        return area;
    };

    var getKeyword = function() {
        return keyword;
    };

    var getCategories = function() {
        return categories;
    };

    var getSources = function() {
        return sources;
    };

    var getMaxDistance = function() {
        return maxDistance;
    };

    var getMinPois = function() {
        return minPois;
    };

    var getParams = function() {
        return new Params.Builder()
            .withKeyword(keyword)
            .withArea(area)
            .withType(type)
            .withCategories(categories)
            .withSources(sources)
            .withMinPois(minPois)
            .withMaxDistance(maxDistance)
            .build();
    };

    return {
        setArea: setArea,
        setKeyword: setKeyword,
        setType: setType,
        setCategories: setCategories,
        setSources: setSources,
        setMinPois: setMinPois,
        setMaxDistance: setMaxDistance,
        getArea: getArea,
        getKeyword: getKeyword,
        getType: getType,
        getCategories: getCategories,
        getSources: getSources,
        getParams: getParams,
        getMinPois: getMinPois,
        getMaxDistance: getMaxDistance,
        APP_STATE_CHANGED_EVT: APP_STATE_CHANGED_EVT,
        AREA_CHANGED_EVT: AREA_CHANGED_EVT,
        KEYWORD_CHANGED_EVT: KEYWORD_CHANGED_EVT,
        TYPE_CHANGED_EVT: TYPE_CHANGED_EVT,
        CATEGORIES_CHANGED_EVT: CATEGORIES_CHANGED_EVT,
        SOURCES_CHANGED_EVT: SOURCES_CHANGED_EVT,
        MIN_POIS_CHANGED_EVT: MIN_POIS_CHANGED_EVT,
        MAX_DISTANCE_CHANGED_EVT: MAX_DISTANCE_CHANGED_EVT
    };
};

module.exports = AppState;