
var io = require('socket.io')();

io.on('connection', function (socket) {
    
    socket.emit('server:message', { status: 'connection success' });
    
    socket.on('client:connection', function (data) {
        //if (data.client == 'mobile') {
            // this will inform web app about mobile device connection and creates a popup for it
        socket.broadcast.emit('server:mobile:connection', data);
        console.log(data);
        //}                 
    });
    
    // on location data receive from mobile app 
    socket.on('mobile:location', function (data) {
        // broadcast the data from mobile to desktop web app client
        socket.broadcast.emit('server:location', data);
    });

    socket.on('client:disconnection', function (data) {
        if (data.client == 'mobile') {
            console.log('mobile client disconnected');
            // need to figure out how to categorise phone and web disconnection
            socket.broadcast.emit('server:mobile:disconnection');
        }
        else if (data.client == 'web') {
            console.log('web client disconnected');
        }
    });
});



module.exports = io;