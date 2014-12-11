'use strict';

var $ = require('jquery');
var MapView = require('./widgets/MapWidget');
var mapContainer = $('.mainMapContainer:first')[0];

var map = new MapView(mapContainer);
