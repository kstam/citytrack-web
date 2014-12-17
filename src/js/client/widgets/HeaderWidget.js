'use strict';

var $ = require('jquery');
var utils = require('common/utils');
var AreaSelectWidget = require('client/widgets/AreaSelectWidget');
var SearchDropdownWidget = require('client/widgets/SearchDropdownWidget');
var areaService = require('client/services/areaService');
var appState = require('client/appState');
var eventBus = require('client/eventBus');


var HeaderWidget = function(theHeaderElement) {
    var headerElement = utils.getElement(theHeaderElement);
    var $headerElement = $(headerElement);

    var keywordContainer = $headerElement.find('.keywordBox:first')[0];
    var areaSelectContainer = $headerElement.find('.areaDropdown:first')[0];

    var areaSelectWidget = new AreaSelectWidget(areaSelectContainer);
    var keywordWidget = new SearchDropdownWidget(keywordContainer);

    var initialize = function() {

    };

    initialize();
};

module.exports = HeaderWidget;
