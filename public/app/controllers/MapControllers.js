﻿'use strict';

/* Controllers */

var mapControllers = angular.module('mapControllers', ['socketServices']);

mapControllers.controller('MapCtrl', ['$scope', 'Location', 'Socket', function ($scope, Location, Socket) {
        
        $scope.viewTitle = 'MapView';    
        
        // array to store icons/markers on the map
        var userLocationMarkersArray = [];
        var userGeolocationDataArray = [];
        
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
        
        //var geolocation = new ol.Geolocation({
        //    projection: view.getProjection(),      
        //    trackingOptions: {
        //        maximumAge: 10000,
        //        enableHighAccuracy: true,
        //        timeout: 600000
        //    }      
        //});
        
        //geolocation.on('change', function (evt) {
        //    var position = geolocation.getPosition();
        //    var heading = geolocation.getHeading();

        //    $scope.longitude = position[0];
        //    $scope.latitude = position[1];
        //    $scope.heading = Math.round(radToDeg(heading));

        //    if (userLocationMarkersArray.length > 0) {
        //        for (var i = 0; i < userLocationMarkersArray.length; i++) {
        //            var overlay = userLocationMarkersArray[i].overlay;
        //            overlay.setPosition(position);
        //            view.setCenter(position);
        //        }
                
        //    }
        //});
        
        //geolocation.on('error', function () {
        //    alert('geolocation error');
        //    // FIXME we should remove the coordinates in positions
        //});
        
        // show popup when click on a cab icon 
        $('.location_marker').click(function () {
            var i;
            for (i = 0; i < userLocationMarkersArray.length; i++) {
                var overlay = userLocationMarkersArray[i].overlay;
                //console.log(mapOverlays[i]);
                //console.log(overlay.getElement());
                if (overlay.getElement().is($(this))) {
                    //console.log('true');
                    // popover
                    $(overlay.getElement()).popover({
                    content: 'User: ' + userLocationMarkersArray[i].user});
                } else {
                    //console.log('false');
                }
            }
        });
        
        /* SOCKET EVENT HANDLERS */
        //var socket = io.connect('http://52.28.143.209:3000');      
        //var socket = io.connect('http://localhost:3000');
        // connection status from the server
        Socket.On('server:message', function (data) {
            $scope.status = data.status;
        });
        
        // location data from the server (sent by mobile to the server => MOBILE-->SERVER-->WEB
        Socket.On('server:location', function (clientData) {
            //$scope.longitude = data.longitude;
            //$scope.latitude = data.latitude;
            var mobileLocation = [clientData.longitude, clientData.latitude];
            var projectedLocation = ol.proj.transform(mobileLocation, 'EPSG:4326', 'EPSG:3857');
            
            for (var userGeolocationObject in userGeolocationDataArray) {
                // find the user who sent location from the array and update
                if (userGeolocationObject.user == clientData.user) {
                    var geolocation = userGeolocationObject.geolocation;
                    geolocation.set('position', projectedLocation);
                    geolocation.set('accuracy', clientData.accuracy);
                    geolocation.set('speed', clientData.speed);
                    geolocation.set('heading', degToRad(clientData.bearing));
                    geolocation.changed();
                    console.log(data);
                }
            }
        });
        
        if (userGeolocationDataArray.length > 0) {
            for (var userGeolocationObject in userGeolocationDataArray) {
                var geolocation = userGeolocationDataArray.geolocation;
                var user = userGeolocationDataArray.user;
                geolocation.on('change', function (evt) {
                    var position = geolocation.getPosition();
                    var heading = geolocation.getHeading();
                    
                    $scope.longitude = position[0];
                    $scope.latitude = position[1];
                    $scope.heading = Math.round(radToDeg(heading));
                    
                    if (userLocationMarkersArray.length > 0) {
                        for (var userLocationMarkerObject in userLocationMarkersArray) {
                            if (userLocationMarkerObject.user == user) {
                                var overlay = userLocationMarkerObject.overlay;
                                overlay.setPosition(position);
                                view.setCenter(position);
                            }                           
                        }
                    }
                })
             }
        }
        
        // on mobile connection event from the server 
        // creates a popup for this mobile
        Socket.On('server:mobile:connection', function (clientData) {
            //var popup = $('#popup').clone().show();
            //var popupContent = $(popup).find('#popup-content').html('<p>' + clientData.name + '</p>');
            //var marker = $('#marker');
            var locationMarkerIcon = $('.location_marker').clone(true, true); // clone(true) -> fixes click event on icon 
            var overlay = new ol.Overlay({
                element: locationMarkerIcon,
                positioning: 'bottom-center',
                stopEvent: false
            });
            
            // name should be unique for each connected device -> username of the driver
            var userLocationMarkerObject = { user: clientData.user , overlay: overlay };          
            // adding new overlay into the array
            map.addOverlay(overlay);
            // adding new overlay on the map to make it visible
            userLocationMarkersArray.push(userLocationMarkerObject);
            
            // user geolocation data
            var geolocation = new ol.Geolocation({
                projection: view.getProjection(),      
                trackingOptions: {
                    maximumAge: 10000,
                    enableHighAccuracy: true,
                    timeout: 600000
                }
            });
            //geolocation.set("user", clientData.user);
            var userGeolocationObject = { user: clientData.user, geolocation: geolocation };
            // adding new user geolocation var into the array
            userGeolocationDataArray.push(userGeolocationObject);
            
            console.log('mobile connect');
            console.log('Devices online: ' + userLocationMarkersArray.length.toString());
        });
        // on mobile disconnection event from the server
        Socket.On('server:mobile:disconnection', function (clientData) {
            // get the name of the disconnected device and remove from the array using that name
            //  var clientName = clientData.name;
            var user = clientData.user;

            var i;
            // remove user marker from the map
            if (userLocationMarkersArray.length > 0) {
                for (i = 0; i < userLocationMarkersArray.length; i++) {
                    var userLocationMarkerObject = userLocationMarkersArray[i];
                    
                    if (user == userLocationMarkerObject.user) {
                        //remove the the map
                        map.removeOverlay(userLocationMarkerObject.overlay);
                        // remove from the array
                        userLocationMarkersArray.splice(i, 1);
                    }
                }
            }
            // remove user geolocation from the array
            if (userGeolocationDataArray.length > 0) {
                for (i = 0; i < userGeolocationDataArray.length; i++) {
                    var userGeolocationObject = userGeolocationDataArray[i];
                    
                    if (user == userGeolocationObject.user) {
                        // remove from the array
                        userGeolocationDataArray.splice(i, 1);
                    }
                }
            }
            
            console.log('User Location Marker #: ' + userLocationMarkersArray.length);
            console.log('User Geolocation #: ' + userGeolocationDataArray.length);

            //var object = mapOverlays[0];
            //var overlay = object.overlay;
            //map.removeOverlay(overlay);
            //var index = mapOverlays.indexOf(object);
            //if (index !== -1) {
            //    mapOverlays.splice(index, 1);
            //}
            //console.log(mapOverlays.length);
        });

}]);