
var io = require('socket.io')();

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('foo', function (data) {
        console.log(data);
    });
});

module.exports = io;