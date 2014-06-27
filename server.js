var config = require('./config'),
    express = require('express.io'),
    app = express();

app.http().io();

app.listen(config.port);

app.use("/", express.static(__dirname + '/public/'));

app.io.route('target-connect', function(req) {
  req.io.join(req.data.id);
  req.io.broadcast('target connected');
});

app.io.route('console-connect', function(req) {
  req.io.respond();

  req.io.join(req.data.id);
  req.io.room(req.data.id).broadcast('console-connect');
});

app.io.route('command', function(req) {
  req.io.room(req.data.id).broadcast('command', req.data.command);
});

app.io.route('log', function(req) {
  req.io.room(req.data.id).broadcast('log', req.data.log);
});
