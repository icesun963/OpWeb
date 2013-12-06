var static = require('node-static');

var file = new static.Server('./web');

var comet = require('./res/comet/comet.io.js').createServer();

require('http').createServer(function (request, response) {
    request.on('end', function () {
	 if (!comet.serve(request, response)) {
        	file.serve(request, response);
	 }
    }).resume();
}).listen(8080);


comet.on('connection', function (socket) {
  console.log('connected...patient');
  var total_time = 0;
  var start_time = new Date();
  socket.emit('test.message', { count:0 });
  socket.on('test.response', function(data) {
    total_time += new Date() - start_time;
    if (data.count++ < 100) {
      setTimeout(function() {
        start_time = new Date();
        socket.emit('test.message', { count:data.count });
      }, 10000);
    } else {
      console.log('success', total_time);
    }
  });
});
