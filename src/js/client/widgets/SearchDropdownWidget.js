'use strict';

var $ = require('jquery');
var selectize = require('selectize');
var utils = require('common/utils');
var domify = require('domify');
var template = require('widgets/search-dropdown-widget.hbs');

var SearchDropdownWidget = function SearchDropdownWidget(theParent) {
    var element = domify(template());
    var parent = utils.getElement(theParent);
    var selectize;

    var initialize = function() {
        $(parent).append(element);
        $(element).selectize({
            valueField: 'value',
            labelField: 'label',
            searchField: 'value'
        });
        selectize = element.selectize;
    };

    var validateOption = function(option) {
        if (!(option && option.value && option.label)) {
            throw new Error('Attemped to add invalid option ' + option);
        }
    };

    var selectValue = function(value) {
        if (value !== getValue()) {
            selectize.setValue(value);
        }
    };

    var getValue = function() {
        var value = selectize.getValue();
        return (value) ? value : undefined;
    };

    var getAvailableValues = function() {
        return Object.keys(selectize.options);
    };

    var setOptions = function(data) {
        if (!utils.isArray(data)) {
            throw new Error('data should be an array');
        }

        data.forEach(function(entry) {
            validateOption(entry);
        });

        var selectedValue = getValue();
        selectize.clearOptions();
        selectize.load(function(callback) {
            callback(data);
        });
        selectValue(selectedValue);
    };

    var onChange = function(listener) {
        selectize.on('change', listener);
    };

    var onType = function(listener) {
        selectize.on('type', listener);
    };

    initialize();

    return {
        getAvailableValues: getAvailableValues,
        setData: setOptions,
        selectValue: selectValue,
        getValue: getValue,

        onChange: onChange,
        onType: onType
    };
};

SearchDropdownWidget.SELECTION_CHANGED_EVT = 'SearchDropdown:SelectionChanged';

module.exports = SearchDropdownWidget;
