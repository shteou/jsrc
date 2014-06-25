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
  req.io.join(req.data);
  req.io.broadcast('console connected');
});

app.io.route('command', function(req) {
  req.io.broadcast('command ' + req.data);
});

app.io.route('log', function(req) {
  req.io.broadcast('log ' + req.data);
});
