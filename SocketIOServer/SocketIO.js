
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
    
    socket.on('client:connection', onClientConnect);
    
    function onClientConnect(clientData) {
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
            
            socket.broadcast.emit('server:mobile:connection', client);
        }
        else if (clientData.type == 'web') {
            // this will inform other clients about web client connection
            socket.broadcast.emit('server:web:connection', clientData);
            
            // when web is connected emit mobile clients array already connected to the server
            // 
            socket.emit('server:online:mobile:clients', mobileClients);
            
            console.log('web:client:connection');
        }
    }
    
    // on location data receive from the mobile app 
    socket.on('mobile:location', onMobileLocation);
    
    function onMobileLocation(clientData) {
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
    }
    
    socket.on('mobile:client:status', onMobileClientStatus);
    
    function onMobileClientStatus(clientData) {
        /**
         * clientData.clientId
         * clientData.client
         * clientData.clientStatus
         */
        for (var i = 0; i < mobileClients.length; i++) {
            if (mobileClients[i].clientData.clientId == clientData.clientId) {
                mobileClients[i].clientData.clientStatus = clientData.clientStatus;
            }
        }
        socket.broadcast.emit('server:mobile:client:status', clientData);
    }
    
    socket.on('mobile:client:message:send', onMobileClientMessageSend);
    
    function onMobileClientMessageSend(clientData) {
        /*
         * clientData.to_id_user_profile 
         * clientData.from_id_user_profile 
         * clientData.content 
         * clientData.time 
         * clientData.id_message
         * "fromUser": {
            "id_user_profile": 3,
            "first_name": "Elon",
            "last_name": "Musk"
        },
        "toUser": {
            "id_user_profile": 2,
            "first_name": "Diyorbek",
            "last_name": "Islomov"
        } 
         */   
        socket.broadcast.emit('server:mobile:client:message:send', clientData);
    }
    
    socket.on('web:client:map:controller:create', onWebClientMapControllerCreate);
    
    function onWebClientMapControllerCreate(clientData) {
        if (clientData.type == 'web') {
            // when web is connected emit mobile clients array already connected to the server
            // 
            socket.emit('server:online:mobile:clients', mobileClients);
        }       
    }

    socket.on('client:disconnect', onClientDisconnect);

    function onClientDisconnect(clientData) {
        // remove the socket and its data from the global array
        deleteClient(socket);
        
        if (clientData.type == 'mobile') {
            console.log('mobile client disconnected');
            // need to figure out how to categorise phone and web disconnection
            socket.broadcast.emit('server:mobile:disconnection', clientData);

            //socket.off('client:connection', onClientConnect);
            //socket.off('mobile:location', onMobileLocation);
            //socket.off('mobile:client:status', onMobileClientStatus);
            //socket.off('mobile:client:message:send', onMobileClientMessageSend);
        }
        else if (clientData.type == 'web') {
            console.log('web client disconnected');
            
            socket.broadcast.emit('server:web:disconnection', clientData);

            //socket.off('client:connection', onClientConnect);
            //socket.off('web:client:map:controller:create', onWebClientMapControllerCreate);
        }
    }
});


module.exports = io;