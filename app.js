const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config()
let cors = require('cors')
let sexyRequire = require('sexy-require')
const mongoconnecton = require('./util/mongo_connection').connection

// Routers
let indexRouter = require('/routes/index')
let verbsRouter = require('/routes/verbs')
let videos_router = require('/routes/videos')
let vocabularyRouter = require('/routes/vocabulary')
let verbsApiRouter = require('/routes/verbs_api')
let videos_api_router = require('/routes/videos_api')
let vocabularyApiRouter = require('/routes/vocabulary_api')
let verb_conjugation_api_router = require('/routes/verb_conjugation_api')
let contextRouter = require('/routes/utilities/context')

var app = express();

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/verbes', verbsRouter)
app.use('/videos', videos_router)
app.use('/vocabulaire', vocabularyRouter)
app.use('/api/verbes', verbsApiRouter)
app.use('/api/videos', videos_api_router)
app.use('/api/vocabulaire', vocabularyApiRouter)
app.use('/api/conjugaison_verbe/', verb_conjugation_api_router)
app.use('/context', contextRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.render('404')
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app
