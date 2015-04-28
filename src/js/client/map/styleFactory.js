'use strict';

var defaultStyle = {
    color: '#d9534f',
    fillColor: '#d9534f',
    opacity: 0.9
};
var clickedStyle = {
    color: '#28326a',
    fillColor: '#28326a',
    fillOpacity: 0.5
};
var hoverStyle = {
    color: '#6078ff',
    fillColor: '#6078ff',
    fillOpacity: 0.5
};

module.exports = {
    getDefaultStyleForFeature: function() {
        return defaultStyle;
    },
    getHoverStyleForFeature: function() {
        return hoverStyle;
    },
    getClickedStyleForFeature: function() {
        return clickedStyle;
    }
};
