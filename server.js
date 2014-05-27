var config = require('./config'),
    app = require('express.io')();

app.http().io();

app.listen(config.port);
