'use strict';

var $ = require('jquery');
var MapWidget = require('client/widgets/MapWidget');

// elements
var mapContainer = $('.mainMapContainer:first')[0];

MapWidget(mapContainer);
