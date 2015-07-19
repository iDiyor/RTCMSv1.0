'use strict';

/* Controllers */

var mapControllers = angular.module('mapControllers', ['socketServices']);

mapControllers.controller('MapCtrl', ['$scope', 'Location', 'Socket', function ($scope, Location, Socket) {
        
        $scope.viewTitle = 'MapView';    
        
        var mapOverlays = {};
       
        // view
        var view = new ol.View({
            //center: london,
            zoom: 15
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
            
            $scope.longitude = position[0];
            $scope.latitude = position[1];

            var overlay = mapOverlays[0];
            overlay.setPosition(position);
            view.setCenter(position);
            
        });
        
        geolocation.on('error', function () {
            alert('geolocation error');
            // FIXME we should remove the coordinates in positions
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
            geolocation.changed();
            console.log(data);
        });
        
        // on mobile connection event from the server 
        // creates a popup for this mobile
        Socket.On('server:mobile:connection', function (data) {
            var popup = $('#popup').clone().show();
            var popupContent = $(popup).find('#popup-content').html('<p>my android</p>');
            var overlay = new ol.Overlay({
                element: popup
            });
            mapOverlays.push(overlay);
            map.addOverlay(overlay);
        });


        //var i;
        //var overlay, overlay2;
        //var position;

        //Location.GetLocation('', function (res) {
            
        //    for (i = 0; i < res.length; i++) {
        //        var position = ol.proj.fromLonLat([res[i].longitude, res[i].latitude]);
        //        var popup = $('#popup').clone().show();//find('#popup-content').html('<p>Hello World!</p>').
        //        var popupContent = $(popup).find('#popup-content').html('<p>' + res[i].description +'</p>');

        //        overlay = new ol.Overlay({
        //            position: position,
        //            element: popup
        //        });

        //        map.addOverlay(overlay);

        //        view.setCenter(position);
        //    };    
        //});    
        
}]);