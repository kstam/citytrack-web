'use strict';

var APP_STATE_CHANGED_EVT = 'AppState:Changed';
var AREA_CHANGED_EVT = 'AppState:AreaChanged';
var KEYWORD_CHANGED_EVT = 'AppState:KeywordChanged';
var utils = require('common/utils');
var Area = require('model/Area');

var AppState = function(eventBus) {

    var area,
        keyword = '';

    var fireChangeEvent = function(eventName) {
        var args = Array.prototype.splice.call(arguments, 0);
        eventBus.broadcastEvent.apply(eventBus, args);
        args[0] = APP_STATE_CHANGED_EVT;
        eventBus.broadcastEvent.apply(eventBus, args);
    };

    var isValidArea = function(area) {
        return (typeof area === 'undefined') || (area instanceof Area);
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

    var getArea = function() {
        return area;
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

    var getKeyword = function() {
        return keyword;
    };

    return {
        setArea: setArea,
        getArea: getArea,
        setKeyword: setKeyword,
        getKeyword: getKeyword,
        APP_STATE_CHANGED_EVT: APP_STATE_CHANGED_EVT,
        AREA_CHANGED_EVT: AREA_CHANGED_EVT,
        KEYWORD_CHANGED_EVT: KEYWORD_CHANGED_EVT
    };
};

module.exports = AppState;