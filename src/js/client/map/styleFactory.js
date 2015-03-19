'use strict';

var defaultStyle = {
    color: '#d9534f',
    opacity: 0.9
};
var clickedStyle = {
    color: '#28326a'
};
var hoverStyle = {
    color: '#6078ff'
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
