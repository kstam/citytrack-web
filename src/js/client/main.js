'use strict';

require('es5-shim');
var $ = require('jquery');
var MapWidget = require('client/widgets/MapWidget');
var SearchDropdownWidget = require('client/widgets/SearchDropdownWidget');

var areaService = require('client/services/areaService');

// elements
var mainMapSection = $('.mainMapSection:first')[0];
var keywordSection = $('.keywordBox:first')[0];
var areaSection = $('.areaDropdown:first')[0];

var areaWidget = new SearchDropdownWidget(areaSection);
new SearchDropdownWidget(keywordSection);
var mainMapWidget = new MapWidget(mainMapSection);

areaWidget.onChange(function() {
    var area = areaMap[areaWidget.getValue()];
    mainMapWidget.setView(area);
});

var areaMap = {};
areaService.getAreas(function(areas) {
    var selectViewModel = [];
    areas.forEach(function(area) {
        areaMap[area.name] = area;
        selectViewModel.push({
            label: area.name,
            value: area.name
        });
    });
    areaWidget.setData(selectViewModel);
});
