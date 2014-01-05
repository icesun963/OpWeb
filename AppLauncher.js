var connect = require('connect'),
    http = require('http'),
    directory = './Web';

var port = process.env.PORT || 5000;
/*connect()
    .use(connect.static(directory))
    .listen(port);
*/

var static = require("node-static");

var file = new static.Server('./Web');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(port);

console.log('Listening on port :' + port);