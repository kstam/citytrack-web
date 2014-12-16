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
new MapWidget(mainMapSection);

areaWidget.onChange(function() {
    console.log(areaWidget.getValue());
});

areaService.getAreas(function(areas) {
    var selectViewModel = [];
    areas.forEach(function(area) {
        selectViewModel.push({
            label: area.name,
            value: area.name
        });
    });
    areaWidget.setData(selectViewModel);
});
