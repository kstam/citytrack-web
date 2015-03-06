/*
    This script is used in order to deploy the app using forever
 */
'use strict';

// Set the port where the app will listen
process.env.PORT = 8090;
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

var forever = require('forever'),
    child = new(forever.Monitor)('bin/start.js', {
        'silent': false,
        'pidFile': 'pids/app.pid',
        'watch': true,
        'watchDirectory': '.',      // Top-level directory to watch from.
        'watchIgnoreDotFiles': true, // whether to ignore dot files
        'watchIgnorePatterns': [], // array of glob patterns to ignore, merged with contents of watchDirectory + '/.foreverignore' file
        'logFile': 'logs/forever.log', // Path to log output from forever process (when daemonized)
        'outFile': 'logs/forever.out', // Path to log output from child stdout
        'errFile': 'logs/forever.err'
    });

child.start();
forever.startServer(child);
