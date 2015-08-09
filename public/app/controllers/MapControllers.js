'use strict';

/* Controllers */

var mapControllers = angular.module('mapControllers', ['socketServices']);

mapControllers.controller('MapCtrl', ['$scope', 'Location', 'Socket', function ($scope, Location, Socket) {
        
        $scope.vehiclesNumberOnMap = 0;  
                
        // array to store icons/markers on the map
        var clientLocationMarkersArray = [];
        var clientGeolocationDataArray = [];
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
        Socket.On('server:message', function (data) {
            $scope.status = data.status;
        });
        
        // location data from the server (sent by mobile to the server => MOBILE-->SERVER-->WEB
        Socket.On('server:location', function (clientData) {
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
        });
        
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
                        
                        console.log(position);
                        $scope.longitude = position[0];
                        $scope.latitude = position[1];
                        $scope.heading = Math.round(radToDeg(heading));
                    }
                }
            }
        });
        
        Socket.On('server:mobile:client:status', function (clientData) {
            /**
             * clientData.clientId
             * clientData.client
             * clientData.clientStatus
             */

        });

        // on mobile connection event from the server 
        // creates a popup for this mobile
        Socket.On('server:mobile:connection', function (clientData) {
           
            //var marker = $('<img class="location_marker" src="/images/cab-icon.png" data-toggle="popover" title="Info" data-content="" data-placement="top" />');
            //marker.click(onClientMarkerClick);
            //var locationMarkerIcon = marker.appendTo('.location_marker_group');

            //var overlay = new ol.Overlay({
            //    element: locationMarkerIcon,
            //    positioning: 'bottom-center'
            //});
            
            //// name should be unique for each connected device -> id of the driver
            //var clientLocationMarkerObject = { client: clientData.client , overlay: overlay };
     
            //// adding new overlay into the array
            //map.addOverlay(overlay);
            //// adding new overlay on the map to make it visible
            //clientLocationMarkersArray.push(clientLocationMarkerObject);
            
            //// client geolocation data
            //var geolocation = new ol.Geolocation({
            //    projection: view.getProjection(),      
            //    trackingOptions: {
            //        maximumAge: 10000,
            //        enableHighAccuracy: true,
            //        timeout: 600000
            //    }
            //});
            ////geolocation.set("client", clientData.client);
            //var clientGeolocationObject = { client: clientData.client, geolocation: geolocation };

            //// adding new client geolocation var into the array
            //clientGeolocationDataArray.push(clientGeolocationObject);
            
            //console.log('mobile connect');
            //console.log('Devices online: ' + clientLocationMarkersArray.length.toString());           
            //console.log('Geolocation online: ' + clientGeolocationDataArray.length.toString());

            //$scope.vehiclesNumberOnMap = clientGeolocationDataArray.length;
            
        });
        
        Socket.On('server:online:mobile:clients', function (mobileClients) {
            
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
                // client.lastKnowLocation -> .latitude .longitude .accuracy ....
                // type: mobile
                var clientObject = {
                    id: client.clientId,
                    name: client.client,
                    status: 'No Job'
                }
                createMarkerAndGeolocationForEachClient(clientObject);
                setGeolocation(clientObject, client.lastKnowLocation);
            }

        });

        // on mobile disconnection event from the server
        Socket.On('server:mobile:disconnection', function (clientData) {
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


            //// remove client marker from the map
            //if (clientLocationMarkersArray.length > 0) {
            //    for (var i = 0; i < clientLocationMarkersArray.length; i++) {
            //        var clientLocationMarkerObject = clientLocationMarkersArray[i];
                    
            //        if (clientId == clientLocationMarkerObject.client.id) {
            //            //remove the the map
            //            map.removeOverlay(clientLocationMarkerObject.overlay);
            //            // remove from the array
            //            clientLocationMarkersArray.splice(i, 1);
            //        }
            //    }
            //}
            //// remove client geolocation from the array
            //if (clientGeolocationDataArray.length > 0) {
            //    for (var i = 0; i < clientGeolocationDataArray.length; i++) {
            //        var clientGeolocationObject = clientGeolocationDataArray[i];
                    
            //        if (clientId == clientGeolocationObject.client.id) {
            //            // remove from the array
            //            clientGeolocationDataArray.splice(i, 1);
            //        }
            //    }
            //}
          
            //console.log('Client Location Marker #: ' + clientLocationMarkersArray.length.toString());
            //console.log('Client Geolocation #: ' + clientGeolocationDataArray.length.toString());
            console.log('Clients #: ' + clientsArray.length);
            $scope.vehiclesNumberOnMap = clientsArray.length;
        });
        
        // client marker popup click handler
        var onClientMarkerClick = function () {
            for (var i = 0; i < clientsArray.length; i++) {
                var overlay = clientsArray[i].overlay;
                if (overlay.getElement().is($(this))) {
                    //console.log('true');
                    // popover
                    $(overlay.getElement()).popover({
                        html: true,
                        container: 'body',
                        content: '<div><p style="display: inline">Name: ' + clientsArray[i].client.name + '</p><br><p>Status: '+ clientsArray[i].client.status +'</p></div>'
                    });
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
            
            // name should be unique for each connected device -> id of the driver
            //var clientLocationMarkerObject = { client: client , overlay: overlay };
            
            // adding new overlay into the array
            map.addOverlay(overlay);
            // adding new overlay on the map to make it visible
            //clientLocationMarkersArray.push(clientLocationMarkerObject);
            
            // client geolocation data
            var geolocation = new ol.Geolocation({
                projection: view.getProjection(),      
                trackingOptions: {
                    maximumAge: 10000,
                    enableHighAccuracy: true,
                    timeout: 600000
                }
            });
            //geolocation.set("client", clientData.client);
            //var clientGeolocationObject = { client: client, geolocation: geolocation };
            
            // adding new client geolocation var into the array
            //clientGeolocationDataArray.push(clientGeolocationObject);
            
            var clientObject = {
                client: client,
                overlay: overlay,
                geolocation: geolocation
            };
            
            clientsArray.push(clientObject);
            

            console.log('mobile connect');
            //console.log('Devices online: ' + clientLocationMarkersArray.length.toString());
            //console.log('Geolocation online: ' + clientGeolocationDataArray.length.toString());
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
}]);