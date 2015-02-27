'use strict';

var APP_STATE_CHANGED_EVT = 'AppState:Changed';
var AREA_CHANGED_EVT = 'AppState:AreaChanged';
var utils = require('common/utils');
var Area = require('model/Area');

var AppState = function(eventBus) {

    var area;

    var fireChangeEvent = function(eventName) {
        var args = Array.prototype.splice.call(arguments, 0);
        eventBus.broadcastEvent.apply(eventBus, args);
        args[0] = APP_STATE_CHANGED_EVT;
        eventBus.broadcastEvent.apply(eventBus, args);
    };

    var setArea = function(newArea) {
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

    return {
        setArea: setArea,
        getArea: getArea,
        APP_STATE_CHANGED_EVT: APP_STATE_CHANGED_EVT,
        AREA_CHANGED_EVT: AREA_CHANGED_EVT
    };
};

module.exports = AppState;