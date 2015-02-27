var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var liveReload = require('connect-livereload');
var pages = require('./routes/index');
var api = require('./routes/api');

var app = express();

// view engine setup
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: 'views/layouts/',
    partialsDir: 'views/partials/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// define where are static files served from
app.use(express.static(path.join(__dirname, 'public')));

// favicon of the application
app.use(favicon(__dirname + '/public/favicon.ico'));

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setup livereload
app.use(liveReload());

// define application endpoints
app.use('/', pages);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers. Development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production error handler. No stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
