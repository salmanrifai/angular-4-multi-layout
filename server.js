var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var http = require('http');
var port = process.argv[2] || 8080;
var expressSession = require('express-session');
var mongoose = require('mongoose');
var mongooseConfig = require('./server/configs/mongoose.config')

   
var app = express();
mongoose.connect(mongooseConfig.url)
require('./server/index')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/*', express.static(path.join(__dirname, 'dist')));


app.use(function (req, res, next) {
    var err = new Error('File Not Found ');
    err.status = 404;
    next(err);
})

app.use(function (err, req, res, next) {
    console.log(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') == 'development' ? err : '';
    res.status(err.status || 500);
    res.render('error')
})


const server = http.createServer(app);
server.listen(port);
server.on('listening', function () {
    console.log(`server listen successfully ${port}`)
})


