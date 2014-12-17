'use strict';

require('es5-shim');
var $ = require('jquery');
var MapWidget = require('client/widgets/MapWidget');
var HeaderWidget = require('client/widgets/HeaderWidget');
var eventBus = require('client/eventBus');
var appState = require('client/appState');

// elements
var headerSection = $('.headerSection:first')[0];
var mainMapSection = $('.mainMapSection:first')[0];

// widgets
var headerWidget = new HeaderWidget(headerSection);
var mainMapWidget = new MapWidget(mainMapSection);

eventBus.on(appState.AREA_CHANGED_EVT, function(newArea) {
    mainMapWidget.setView(newArea);
});
