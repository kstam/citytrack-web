'use strict';

var $ = require('jquery');
require('angular');

var link = function($scope, $element, $attrs) {
    $element.bind('error', function() {
        var errSrc = $attrs.errSrc;
        var src = $attrs.src;
        if (errSrc && src !== errSrc) {
            $attrs.$set('src', errSrc);
        } else {
            $($element).hide();
        }
    });
};

module.exports = {
    replace: true,
    restrict: 'A',
    link: link
};
