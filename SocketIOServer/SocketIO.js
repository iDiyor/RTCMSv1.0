
var io = require('socket.io')();

io.on('connection', function (socket) {
    
    socket.emit('server:message', { status: 'connection success' });
    
    socket.on('mobile:connection', function (data) {
        // this will inform web app about mobile device connection and creates a popup for it
        socket.broadcast.emit('server:mobile:connection', data);         
    });

    // on location data receive from mobile app 
    socket.on('mobile:location', function (data) {
        // broadcast the data from mobile to desktop web app client
        socket.broadcast.emit('server:location', data);
    });

});

module.exports = io;