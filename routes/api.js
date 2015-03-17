var express = require('express');
var Area = require('../src/js/model/Area');
var http = require('http');
var config = require('./config');
var request = require('request');


module.exports = function(req, res) {
    var url = config.SERVICES_HOST + config.SERVICES_ENDPOINT + require('url').parse(req.url).path;
    req.pipe(request(url)).pipe(res);
};
