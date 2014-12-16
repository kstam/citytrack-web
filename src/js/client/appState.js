'use strict';


var APP_STATE_CHANGED_EVT = 'AppState:Changed';
var AREA_CHANGED_EVT = 'AppState:AreaChanged';
var eventBus = require('client/eventBus');

var AppState = function() {

    var area;

    var fireChangeEvent = function(eventName) {
        var args = Array.prototype.splice.call(arguments, 1);
        eventBus.emitEvent(eventName, args);
        eventBus.emitEvent(APP_STATE_CHANGED_EVT, args);
    };

    var setArea = function(newArea) {
        area = newArea;
        fireChangeEvent(AREA_CHANGED_EVT, newArea);
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

var appState = new AppState();

module.exports = appState;