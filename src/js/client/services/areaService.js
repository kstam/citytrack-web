'use strict';

var $ = require('jquery');
var Area = require('model/Area');

var extractArea = function(a) {
    return new Area(a.name, a.center, a.boundingBox);
};

var extractAreas = function(areasResponse) {
    var areas = [];
    areasResponse.forEach(function(areaResponse) {
        areas.push(extractArea(areaResponse));
    });
    return areas;
};

var getAreas = function getAreas(callback) {
    $.get('/api/areas')
        .done(function(data) {
            callback(extractAreas(data));
        });
};

module.exports = {
    getAreas: getAreas
};
