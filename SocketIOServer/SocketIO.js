
var io = require('socket.io')();

io.on('connection', function (socket) {
    
    socket.emit('server:message', { status: 'connection success' });
    
    socket.on('client:connection', function (clientData) {
        if (clientData.type == 'mobile') {
            // this will inform web app about mobile device connection and creates a popup for it
            socket.broadcast.emit('server:mobile:connection', clientData);
            console.log('client:connection');
        }
        else if (clientData.type == 'web') {
            // this will inform other clients about web client connection
            socket.broadcast.emit('server:web:connection', clientData);
        }        
    });
    
    // on location data receive from the mobile app 
    socket.on('mobile:location', function (clientData) {
        // broadcast the data from mobile to desktop web app client
        socket.broadcast.emit('server:location', clientData);
        console.log('mobile:location');
    });

    socket.on('client:disconnection', function (clientData) {
        if (clientData.type == 'mobile') {
            console.log('mobile client disconnected');
            // need to figure out how to categorise phone and web disconnection
            socket.broadcast.emit('server:mobile:disconnection', clientData);
        }
        else if (clientData.type == 'web') {
            console.log('web client disconnected');
        }
    });
});



module.exports = io;