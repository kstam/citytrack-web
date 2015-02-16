var express = require('express');
var Area = require('../src/js/model/Area');
var http = require('http');
var config = require('./config');
var proxy = require('express-http-proxy');

module.exports = proxy(config.SERVICES_HOST, {
    forwardPath: function(req, res) {
        return config.SERVICES_ENDPOINT + require('url').parse(req.url).path;
    }
});
