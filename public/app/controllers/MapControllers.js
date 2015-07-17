'use strict';

/* Controllers */

var mapControllers = angular.module('mapControllers', []);

mapControllers.controller('MapCtrl', ['$scope', 'Location', function ($scope, Location) {
        
        $scope.viewTitle = 'MapView';    

        var view = new ol.View({
            //center: london,
            zoom: 15
        });    
        
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
        
        var i;
        var overlay, overlay2;
        var position;

        Location.GetLocation('', function (res) {
            
            for (i = 0; i < res.length; i++) {
                var position = ol.proj.fromLonLat([res[i].longitude, res[i].latitude]);
                var popup = $('#popup').clone().show();//find('#popup-content').html('<p>Hello World!</p>').
                var popupContent = $(popup).find('#popup-content').html('<p>' + res[i].description +'</p>');

                overlay = new ol.Overlay({
                    position: position,
                    element: popup
                });

                map.addOverlay(overlay);

                view.setCenter(position);
            };    
        });    
        

        var socket = io.connect('http://52.28.143.209:3000/');
        
        //var socket = io.connect('http://localhost:3000/');
        socket.on('server:location', function (data) {
            $scope.longitude = data.longitude;
            $scope.latitude = data.latitude;
            
        });
}]);