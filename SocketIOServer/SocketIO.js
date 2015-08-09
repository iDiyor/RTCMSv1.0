
var io = require('socket.io')();

var clients = [];

var removeSocket = function (client) {
    for (var i = 0; i < clients.length; i++) {
        if (clients[i] === client) {
            clients.slice(i, 1);   
        }   
    }
    console.log('Size: ' + clients.length);   
}

io.on('connection', function (socket) {
    
    /**
     * @TODO
     * Array to store all the clients and send it to the web app when it is connected
     * Improvements: client can connect before web app lauched
     */
    

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
        
        clients.push(socket);
        console.log('Size: ' + clients.length);   
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

        removeSocket(socket);
    });
});



module.exports = io;