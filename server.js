var config = require('./config'),
    express = require('express.io'),
    app = express();

app.http().io();

app.listen(config.port);

app.use("/", express.static(__dirname + '/public/'));

app.io.route('target-connect', function(req) {
  req.io.join(req.data);
  req.io.broadcast('target connected');
});

app.io.route('console-connect', function(req) {
  console.log("New console connected with ID " + req.data.id);

  req.io.join(req.data.id);
  req.io.room(req.data.id).broadcast('console-connect');
});

app.io.route('command', function(req) {
  console.log("New command received: " + req.data.command);
  req.io.room(req.data.id).broadcast('command ' + req.data.command);
});

app.io.route('log', function(req) {
  req.io.room(req.data.id).broadcast('log ' + req.data.log);
});
