'use strict';

var urlConfig = {
    SERVICES_HOST: 'http://citytrackapi.magellan.imis.athena-innovation.gr',
    SERVICES_ENDPOINT: '/citytrack-api'
};

var urlConfigDev = {
    SERVICES_HOST: 'http://localhost:8079',
    SERVICES_ENDPOINT: ''
};

module.exports = (process.env.NODE_ENV === 'production') ? urlConfig : urlConfigDev;
