var connect = require('connect'),
    http = require('http'),
    directory = '/Web';

var port = process.env.PORT || 5000;
connect()
    .use(connect.static(directory))
    .listen(port);

console.log('Listening on port :' + port);