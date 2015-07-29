'use strict';

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
        //$('.location_marker').click(function () {
            
        //    for (var i = 0; i < userLocationMarkersArray.length; i++) {
        //        var overlay = userLocationMarkersArray[i].overlay;
        //        //console.log(mapOverlays[i]);
        //        //console.log(overlay.getElement());
        //        if (overlay.getElement().is($(this))) {
        //            console.log('true');
        //            // popover
        //            $(overlay.getElement()).popover({
        //            content: 'User: ' + userLocationMarkersArray[i].user});
        //        } else {
        //            console.log('false');
        //        }
        //    }
        //});
        
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
                        
            for (var i = 0; i < userGeolocationDataArray.length; i++) {
                var userGeolocationObject = userGeolocationDataArray[i];
                
                // find the user who sent location from the array and update
                if (userGeolocationObject.user == clientData.user) {
                    //console.log('GEOLOCATION NAME MATCH');
                    var mobileLocation = [clientData.longitude, clientData.latitude];
                    var projectedLocation = ol.proj.transform(mobileLocation, 'EPSG:4326', 'EPSG:3857');

                    var geolocation = userGeolocationObject.geolocation;
                    geolocation.set('position', projectedLocation);
                    geolocation.set('accuracy', clientData.accuracy);
                    geolocation.set('speed', clientData.speed);
                    geolocation.set('heading', degToRad(clientData.bearing));
                    // TODO geolocation service same as openlayers -> with changed, on, ... events
                    geolocation.changed();
                    $scope.$emit('LocationUpdate', { user: clientData.user });
                    
                    //console.log(clientData);
                    // check set of var
                    //console.log(geolocation);
                }
            }
            //$scope.$emit('LocationUpdate');
        });
        
        $scope.$on('LocationUpdate', function (event, args) {
            // line below never called
            if (userGeolocationDataArray.length > 0 && userLocationMarkersArray.length > 0) {
                // user geolocation array
                for (var i = 0; i < userGeolocationDataArray.length; i++) {
                    if (userGeolocationDataArray[i].user == args.user) {
                        var geolocation = userGeolocationDataArray[i].geolocation;
                        // user makers array
                        for (var j = 0; j < userLocationMarkersArray.length; j++) {
                            if (userLocationMarkersArray[j].user == args.user) {
                                console.log('GEOLOCATION NAME MATCH');
                                var position = geolocation.getPosition();
                                var heading = geolocation.getHeading();

                                var overlay = userLocationMarkersArray[j].overlay;
                            
                                overlay.setPosition(position);
                                view.setCenter(position);

                                console.log(position);
                                $scope.longitude = position[0];
                                $scope.latitude = position[1];
                                $scope.heading = Math.round(radToDeg(heading));
                            }
                        } 
                    }
                }
            }


            //if (userGeolocationDataArray.length > 0 && userLocationMarkersArray.length > 0) {
            //    for (var i = 0; i < userGeolocationDataArray.length; i++) {
            //        var userGeolocationObject = userGeolocationDataArray[i];
            //        var user = userGeolocationObject.user;
            //        for (var j = 0; j < userLocationMarkersArray.length; j++) {
            //            var userLocationMarkerObject = userLocationMarkersArray[j];
            //            if (userLocationMarkerObject.user == user) {
            //                var geolocation = userGeolocationObject.geolocation;
            //                var user = userGeolocationObject.user;
            //                var position = geolocation.getPosition();
            //                var heading = geolocation.getHeading();
            //                var overlay = userLocationMarkerObject.overlay;
                            

            //                overlay.setPosition(position);
            //                view.setCenter(position);

                            
            //                console.log(position);
            //                $scope.longitude = position[0];
            //                $scope.latitude = position[1];
            //                $scope.heading = Math.round(radToDeg(heading));
            //            }
            //        }
            //    }
            //}
        });

        
        
        // on mobile connection event from the server 
        // creates a popup for this mobile
        Socket.On('server:mobile:connection', function (clientData) {
            //var popup = $('#popup').clone().show();
            //var popupContent = $(popup).find('#popup-content').html('<p>' + clientData.name + '</p>');
            //var marker = $('#marker');
            //var locationMarkerIcon = $('.location_marker').clone(true, true); // clone(true) -> fixes click event on icon 
            var locationMarkerIcon = $('<img class="location_marker" src="/images/cab-icon.png" data-toggle="popover" title="Info" data-content="" data-placement="top" />').appendTo('#location_marker_group'); // 
            var overlay = new ol.Overlay({
                element: locationMarkerIcon,
                positioning: 'bottom-center'
            });
            
            // name should be unique for each connected device -> username of the driver
            var userLocationMarkerObject = { user: clientData.user , overlay: overlay };
            //console.log(userLocationMarkerObject);         
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
            //console.log(userGeolocationObject);
            // adding new user geolocation var into the array
            userGeolocationDataArray.push(userGeolocationObject);
            
            console.log('mobile connect');
            console.log('Devices online: ' + userLocationMarkersArray.length.toString());           
            console.log('Geolocation online: ' + userGeolocationDataArray.length.toString());
            
        });
        // on mobile disconnection event from the server
        Socket.On('server:mobile:disconnection', function (clientData) {
            // get the name of the disconnected device and remove from the array using that name
            //  var clientName = clientData.name;
            var user = clientData.user;

            // remove user marker from the map
            if (userLocationMarkersArray.length > 0) {
                for (var i = 0; i < userLocationMarkersArray.length; i++) {
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
                for (var i = 0; i < userGeolocationDataArray.length; i++) {
                    var userGeolocationObject = userGeolocationDataArray[i];
                    
                    if (user == userGeolocationObject.user) {
                        // remove from the array
                        userGeolocationDataArray.splice(i, 1);
                    }
                }
            }
            
            console.log('User Location Marker #: ' + userLocationMarkersArray.length.toString());
            console.log('User Geolocation #: ' + userGeolocationDataArray.length.toString());

            //var object = mapOverlays[0];
            //var overlay = object.overlay;
            //map.removeOverlay(overlay);
            //var index = mapOverlays.indexOf(object);
            //if (index !== -1) {
            //    mapOverlays.splice(index, 1);
            //}
            //console.log(mapOverlays.length);
        });

        // popover click handler
        $('#map').on('click', '.location_marker' ,function () {
            console.log('CLICK CLICK');
            //for (var i = 0; i < userLocationMarkersArray.length; i++) {
            //    var overlay = userLocationMarkersArray[i].overlay;
            //    //console.log(mapOverlays[i]);
            //    //console.log(overlay.getElement());
            //    if (overlay.getElement().is($(this))) {
            //        console.log('true');
            //        // popover
            //        $(overlay.getElement()).popover({
            //            content: 'User: ' + userLocationMarkersArray[i].user
            //        });
            //    } else {
            //        console.log('false');
            //    }
            //}
        }); 

}]);