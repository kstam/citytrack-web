'use strict';

var $ = require('jquery');
var utils = require('common/utils');
var SearchDropdownWidget = require('client/widgets/SearchDropdownWidget');
var areaService = require('client/services/areaService');
var Area = require('model/Area');
var appState = require('client/appState');
var eventBus = require('client/eventBus');

var AreaSelectWidget = function(theContainer) {
    var areas = {};
    var searchDropdownWidget = new SearchDropdownWidget(theContainer);

    var getAvailableAreas = function() {
        return areas;
    };

    var setArea = function(area) {
        utils.verify(area instanceof Area, 'setArea: ' + area + ' is not a valid Area.');
        searchDropdownWidget.selectValue(area.getName());
    };

    var getArea = function() {
        return areas[searchDropdownWidget.getValue()];
    };

    var initializeAvailableAreas = function() {
        areaService.getAreas(function(theAreas) {
            var selectDropdownValues = [];
            theAreas.forEach(function(area) {
                areas[area.name] = area;
                selectDropdownValues.push({
                    label: area.name,
                    value: area.name
                });
            });
            searchDropdownWidget.setData(selectDropdownValues);
        });
    };

    var initializeListeners = function() {
        searchDropdownWidget.onChange(function() {
            appState.setArea(areas[searchDropdownWidget.getValue()]);
        });

        eventBus.on(appState.AREA_CHANGED_EVT, function() {
            setArea(appState.getArea());
        });
    };

    var initialize = function() {
        initializeAvailableAreas();
        initializeListeners();
    };

    initialize();

    return {
        getAvailableAreas: getAvailableAreas,
        setArea: setArea,
        getArea: getArea
    };
};

module.exports = AreaSelectWidget;


