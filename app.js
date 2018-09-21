const express = require('express');
const config  = require('config');
const http    = require("http");
const logger  = require('morgan');
const mongoose = require('mongoose');

const app     = express();
app.set('port', config.port || 8080);
mongoose.connect(config.mongodb.url, function (err, res) {
  if (err) { 
    console.log('Error when connecting to Mongodb : ' + err);
  } 
  else {
    console.log('Successfully connected to Mongodb');
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

require("./routes")(app);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server started on port ' + app.get('port') + '...');
});
