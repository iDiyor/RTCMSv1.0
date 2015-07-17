
var io = require('socket.io')();

io.on('connection', function (socket) {
    
    socket.emit('server:message', { status: 'connection success' });
    // on location data receive from mobile app 
    socket.on('mobile:location', function (data) {
        // broadcast the data from mobile to desktop web app client
        console.log(data);
    });

});

module.exports = io;