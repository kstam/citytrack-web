'use strict';

// Proper angular require using jquery as a dependency
// exports angular global variable
window.$ = window.$ || require('jquery');
window.jQuery = window.jQuery || window.$;

require('angular');
module.exports = window.angular;
