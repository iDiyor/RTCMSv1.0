﻿'use strict';

/* Controllers */

var mapControllers = angular.module('mapControllers', [/*'socketServices'*/]);

mapControllers.controller('MapCtrl', ['$scope', 'Location', /*'Socket', */function ($scope, Location/*, Socket*/) {
        
        $scope.vehiclesNumberOnMap = 0;
        
        var client = {
            name: 'jeb',
            type: 'web'
        };
        
        $scope.socket.emit('web:client:map:controller:create', client);
                
        // client, overlay, geolocation
        var clientsArray = [];
        
        // convert radians to degrees
        function radToDeg(rad) {
            return rad * 360 / (Math.PI * 2);
        }
        // convert degrees to radians
        function degToRad(deg) {
            return deg * Math.PI * 2 / 360;
        }
        
        // view
        var view = new ol.View({
            center: [0,0],
            zoom: 2
        });    
        // layer with OpenStreetMap
        var layer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
        // map
        var map = new ol.Map({
            layers: [layer],
            //overlays: [overlay],
            target: 'map',
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }),
            view: view
        });
                  
        
        /* SOCKET EVENT HANDLERS */
        // connection status from the server
        $scope.socket.on('server:message', onServerMessage);
        
        function onServerMessage(data) {
            $scope.status = data.status;

            $scope.$apply();
        };
        
        // location data from the server (sent by mobile to the server => MOBILE-->SERVER-->WEB        
        $scope.socket.on('server:location', onServerLocation);
                
        function onServerLocation(clientData) {
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
                        
            for (var i = 0; i < clientsArray.length; i++) {
                /**
                 * ClientsArray
                 * -> client
                 * -> overlay
                 * -> geolocation
                 */
                var client = clientsArray[i].client;
                // find the client who sent location from the array and update
                if (client.id == clientData.clientId) {
                    //console.log('GEOLOCATION NAME MATCH');
                    var mobileLocation = [clientData.longitude, clientData.latitude];
                    var projectedLocation = ol.proj.transform(mobileLocation, 'EPSG:4326', 'EPSG:3857');
                    
                    var geolocation = clientsArray[i].geolocation;
                    geolocation.set('position', projectedLocation);
                    geolocation.set('accuracy', clientData.accuracy);
                    geolocation.set('speed', clientData.speed);
                    geolocation.set('heading', degToRad(clientData.bearing));
                    // TODO geolocation service same as openlayers -> with changed, on, ... events
                    geolocation.changed();
                    $scope.$emit('LocationUpdate', { clientId: clientData.clientId });
                }
            }
            $scope.$apply();
        }
        
        $scope.$on('LocationUpdate', function (event, args) {
            // line below never called
            if (clientsArray.length > 0) {
                for (var i = 0; i < clientsArray.length; i++) {
                    var client = clientsArray[i].client;
                    if (client.id == args.clientId) {
                        var geolocation = clientsArray[i].geolocation;
                        var position = geolocation.getPosition();
                        var heading = geolocation.getHeading();
                        
                        var overlay = clientsArray[i].overlay;
                        
                        overlay.setPosition(position);
                        view.setCenter(position);
                        view.setZoom(10);
                    }
                }
            }
            $scope.$apply();
        });
        

        $scope.socket.on('server:mobile:client:status', onServerMobileClientsStatus);
        
        function onServerMobileClientsStatus(clientData) {
            /**
             * clientData.clientId
             * clientData.client
             * clientData.clientStatus
             */ 

            for (var i = 0; i < clientsArray.length; i++) {
                if (clientData.clientId === clientsArray[i].client.id) {
                    clientsArray[i].client.status = clientData.clientStatus;
                    console.log(clientsArray[i].client.status);

                    var overlay = clientsArray[i].overlay;
                    // popover
                    $(overlay.getElement()).popover({
                        html: true,
                        container: 'body',
                        trigger: 'click',
                        content: '<div><p style="display: inline">Name: ' + '<b>' + clientsArray[i].client.name + '</b></p><br><p>Status: ' + '<b>' + clientsArray[i].client.status + '</b></p></div>'
                    });
                }
            }

            //$scope.$emit('LocationUpdate', { clientId: clientData.clientId });
            $scope.$apply();
        }

        // on mobile connection event from the server 
        // creates a popup for this mobile        
        $scope.socket.on('server:mobile:connection', onServerMobileConnection);
               
        function onServerMobileConnection(clientData) {
            
            /**
            * clientData.clientData
            * -> client ID: String - ID ;
            * -> client: String - client name(name of the driver) 
            * -> last known location: Location
            * -> type: String - mobile
            */
           var client = clientData.clientData;

           var clientObject = {
                id: client.clientId,
                name: client.client,
                status: client.clientStatus
            }

            createMarkerAndGeolocationForEachClient(clientObject);
            setGeolocation(clientObject, client.lastKnowLocation);

            $scope.$apply();
        }
        
        $scope.socket.on('server:online:mobile:clients', onServerOnlineMobileClients);
                
        function onServerOnlineMobileClients(mobileClients) {
            console.log(mobileClients);
            /**
             * mobileClients
             * -> client ID: String - ID ;
             * -> client: String - client name(name of the driver) 
             * -> last known location: Location
             * -> type: String - mobile
             */ 
            for (var i = 0; i < mobileClients.length; i++) {
                var client = mobileClients[i].clientData;
                // client.clientId
                // client.client
                // client.clientStatus
                // client.lastKnowLocation -> .latitude .longitude .accuracy ....
                // type: mobile
                var clientObject = {
                    id: client.clientId,
                    name: client.client,
                    status: client.clientStatus
                }
                createMarkerAndGeolocationForEachClient(clientObject);
                setGeolocation(clientObject, client.lastKnowLocation);
            }

            $scope.$apply();
        };

        // on mobile disconnection event from the server
        $scope.socket.on('server:mobile:disconnection', onServerMobileDisconnection);

        function onServerMobileDisconnection(clientData) {
            /**
             * clientData.type
             * clientData.clientId
             * clientData.client
             */
            
            // get the name of the disconnected device and remove from the array using that name
            var clientId = clientData.clientId;
            
            if (clientsArray.length > 0) {
                for (var i = 0; i < clientsArray.length; i++) {
                    var client = clientsArray[i].client;
                    if (clientId == client.id) {
                        var overlay = clientsArray[i].overlay;
                        
                        map.removeOverlay(overlay);
                        
                        clientsArray.splice(i, 1);
                    }
                }
            }
            
            //console.log('Client Location Marker #: ' + clientLocationMarkersArray.length.toString());
            //console.log('Client Geolocation #: ' + clientGeolocationDataArray.length.toString());
            console.log('Clients #: ' + clientsArray.length);
            $scope.vehiclesNumberOnMap = clientsArray.length;
            $scope.$apply();
        };
        

        // client marker popup click handler
        var onClientMarkerClick = function () {
            for (var i = 0; i < clientsArray.length; i++) {
                var overlay = clientsArray[i].overlay;
                if (overlay.getElement().is($(this))) {
                    //console.log('true');
                    
                    var client = clientsArray[i].client;
                    
                    // popover
                    $(overlay.getElement()).popover({
                        html: true,
                        container: 'body',
                        trigger: 'click',
                        content: '<div><p style="display: inline">Name: ' + '<b>' + client.name + '</b></p><br><p>Status: ' + '<b>' + client.status +'</b></p></div>'
                    });

                    $(overlay.getElement()).data("bs.popover").options.content = '<div><p style="display: inline">Name: ' + '<b>' + client.name + '</b></p><br><p>Status: ' + '<b>' + client.status + '</b></p></div>';
                    $(overlay.getElement()).popover("show");
                    
                }
            }
        }
        
        $scope.onAvailableButtonClick = function () {

        }

        $scope.soonToClearButtonClick = function () {

        }

        $scope.onJobButtonClick = function () {

        }

        $scope.onBreakButtonClick = function () {

        }

        $scope.onEmergencyButtonClick = function () {

        }

        var createMarkerAndGeolocationForEachClient = function (client) {
            var marker = $('<img class="location_marker" src="/images/cab-icon.png" data-toggle="popover" title="Info" data-content="" data-placement="top" />');
            marker.click(onClientMarkerClick);
            var locationMarkerIcon = marker.appendTo('.location_marker_group');
            
            var overlay = new ol.Overlay({
                element: locationMarkerIcon,
                positioning: 'bottom-center'
            });
                
            // adding new overlay into the array
            map.addOverlay(overlay);
            
            // client geolocation data
            var geolocation = new ol.Geolocation({
                projection: view.getProjection(),      
                trackingOptions: {
                    maximumAge: 10000,
                    enableHighAccuracy: true,
                    timeout: 600000
                }
            });
                     
            var clientObject = {
                client: client,
                overlay: overlay,
                geolocation: geolocation
            };
            
            clientsArray.push(clientObject);
            
            console.log('Clients #' + clientsArray.length);
            $scope.vehiclesNumberOnMap = clientsArray.length;

        }

        var setGeolocation = function (client, location) {
            
            for (var i = 0; i < clientsArray.length; i++) {
                var clientInArray = clientsArray[i].client;
                if (clientInArray.id == client.id) {
                    var geolocation = clientsArray[i].geolocation;
                       
                    var clientLocation = [location.longitude, location.latitude];
                    var projectedLocation = ol.proj.transform(clientLocation, 'EPSG:4326', 'EPSG:3857');
                    geolocation.set('position', projectedLocation);
                    geolocation.set('accuracy', location.accuracy);
                    geolocation.set('speed', location.speed);
                    geolocation.set('heading', degToRad(location.bearing));
                    geolocation.changed();
                    
                    $scope.$emit('LocationUpdate', { clientId: client.id });
                }    
            }
        }

        $scope.$on('$destroy', function onMapControllerDestroy() {
            // say goodbye to your controller here
            // release resources, cancel request...
            console.log("MapController destroyed");
            

            $scope.socket.off('server:message', onServerMessage);
            $scope.socket.off('server:mobile:connection', onServerMobileConnection);
            $scope.socket.off('server:mobile:client:status', onServerMobileClientsStatus);
            $scope.socket.off('server:mobile:connection', onServerMobileConnection);
            $scope.socket.off('server:online:mobile:clients', onServerOnlineMobileClients);
            $scope.socket.off('server:mobile:disconnection', onServerMobileDisconnection);

            var client = {
                name: 'jeb',
                type: 'web'
            };
            
            $scope.socket.emit('web:client:map:controller:destroy', client);

            //socket.disconnect();
        })
}]);