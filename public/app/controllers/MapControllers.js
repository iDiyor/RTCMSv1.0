'use strict';

/* Controllers */

var mapControllers = angular.module('mapControllers', ['socketServices']);

mapControllers.controller('MapCtrl', ['$scope', 'Location', 'Socket', function ($scope, Location, Socket) {
        
        $scope.viewTitle = 'MapView';    
        
        // array to store icons/markers on the map
        var mapOverlays = [];
        
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
        
        var geolocation = new ol.Geolocation({
            projection: view.getProjection(),      
            trackingOptions: {
                maximumAge: 10000,
                enableHighAccuracy: true,
                timeout: 600000
            }      
        });
        
        geolocation.on('change', function (evt) {
            var position = geolocation.getPosition();
            var heading = geolocation.getHeading();

            $scope.longitude = position[0];
            $scope.latitude = position[1];
            $scope.heading = Math.round(radToDeg(heading));

            if (mapOverlays.length > 0) {
                var overlay = mapOverlays[0].overlay;
                overlay.setPosition(position);
                view.setCenter(position);
            }
        });
        
        geolocation.on('error', function () {
            alert('geolocation error');
            // FIXME we should remove the coordinates in positions
        });
        
        // show popup when click on a cab icon 
        $('.location_marker').click(function () {
            var i;
            for (i = 0; i < mapOverlays.length; i++) {
                var overlay = mapOverlays[i].overlay;
                //console.log(mapOverlays[i]);
                //console.log(overlay.getElement());
                if (overlay.getElement().is($(this))) {
                    console.log('true');
                    
                } else {
                    console.log('false');
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
        Socket.On('server:location', function (data) {
            //$scope.longitude = data.longitude;
            //$scope.latitude = data.latitude;
            var mobileLocation = [data.longitude, data.latitude];
            var projectedLocation = ol.proj.transform(mobileLocation, 'EPSG:4326', 'EPSG:3857');
            geolocation.set('position', projectedLocation);
            geolocation.set('accuracy', data.accuracy);
            geolocation.set('speed', data.speed);
            geolocation.set('heading', degToRad(data.bearing));
            geolocation.changed();
            console.log(data);
        });
        
        // on mobile connection event from the server 
        // creates a popup for this mobile
        Socket.On('server:mobile:connection', function (clientData) {
            //var popup = $('#popup').clone().show();
            //var popupContent = $(popup).find('#popup-content').html('<p>' + clientData.name + '</p>');
            //var marker = $('#marker');
            var icon = $('.location_marker').clone(true); // clone(true) -> fixes click event on icon 
            var overlay = new ol.Overlay({
                element: icon,
                positioning: 'bottom-center',
                stopEvent: false
            });
            
            //init popover
            $('[data-toggle="popover"]').popover();
            var object = { name: 'android', overlay: overlay };

            // adding new overlay into the array
            map.addOverlay(overlay);
            // adding new overlay on the map to make it visible
            mapOverlays.push(object);
            console.log('mobile connect');
            console.log('Devices online: ' + mapOverlays.length.toString());
        });
        // on mobile disconnection event from the server
        Socket.On('server:mobile:disconnection', function (clientData) {
            var object = mapOverlays[0];
            var overlay = object.overlay;
            map.removeOverlay(overlay);
            var index = mapOverlays.indexOf(object);
            if (index !== -1) {
                mapOverlays.splice(index, 1);
            }
            console.log(mapOverlays.length);
        });

}]);