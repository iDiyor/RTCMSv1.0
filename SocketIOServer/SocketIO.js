
var io = require('socket.io')();

var mobileClients = [];

var deleteClient = function (socket) {
    for (var i = 0; i < mobileClients.length; i++) {
        var client = mobileClients[i];
        if (client.socketId == socket.id) {
            mobileClients.splice(i, 1);
        }   
    } 
}

io.on('connection', function (socket) {
    
    socket.emit('server:message', { status: 'connection success' });
    
    socket.on('client:connection', function (clientData) {
        
        if (clientData.type == 'mobile') {
            // this will inform web app about mobile device connection and creates a popup for it
            //socket.broadcast.emit('server:mobile:connection', clientData);
            console.log('mobile:client:connection');

            // client data 
            var client = {
                socketId: socket.id,
                clientData: clientData
            }
            // add the client data including socket and data to the global array
            mobileClients.push(client);

            socket.broadcast.emit('server:online:mobile:clients', mobileClients); 
        }
        else if (clientData.type == 'web') {
            // this will inform other clients about web client connection
            socket.broadcast.emit('server:web:connection', clientData);
            
            // when web is connected emit mobile clients array already connected to the server
            // 
            socket.emit('server:online:mobile:clients', mobileClients); 

            console.log('web:client:connection');
        }
    });
    
    // on location data receive from the mobile app 
    socket.on('mobile:location', function (clientData) {
        // broadcast the data from mobile to desktop web app client
        /**
         * clientData.clientId
         * clientData.client 
         * clientData.longitude
         * clientData.latitude
         * clientData.accuracy
         * clientData.bearing
         * clientData.speed
         * clientData.time
         */
        socket.broadcast.emit('server:location', clientData);
        console.log('mobile:location');
    });
    
    socket.on('mobile:client:status', function (clientData) {
        //data.put("clientId", mClientId);
        //data.put("client", mClient);
        //data.put("clientStatus", status);
        socket.broadcast.emit('server:mobile:client:status', clientData);
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
        
        // remove the socket and its data from the global array
        deleteClient(socket);
    });
});

module.exports = io;