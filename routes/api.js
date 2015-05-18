var config = require('./config');
var request = require('request');

var TIMEOUT = 10 * 60 * 1000; //10min
module.exports = function(req, res) {
    var url = config.SERVICES_HOST + config.SERVICES_ENDPOINT + require('url').parse(req.url).path;

    req.pipe(request({
        url: url,
        timeout: TIMEOUT
    }, function(error){
        if (error && error.code === 'ECONNREFUSED'){
            res.status(500).send('Could\'t reach remote server. Proxy failed');
        }
    })).pipe(res);
};
