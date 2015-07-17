'use strict';

/* Controllers */

var mapControllers = angular.module('mapControllers', []);

mapControllers.controller('MapCtrl', ['$scope', 'Location', function ($scope, Location) {
        
        $scope.viewTitle = 'MapView';    

        var london = ol.proj.fromLonLat([-0.12755, 51.507222]);    
        
        ///* Elements of popup */
        //var popupContainer = document.getElementById('popup');
        //var popupContent = document.getElementById('popup-content');
        //var popupCloser = document.getElementById('popup-closer');
        
        ///* Closes the popup */
        //popupCloser.onclick = function () {
        //    overlay.setPosition(undefined);
        //    closer.blur();
        //    return false;
        //};
        
        
        /* An overlay to anchor the popup to the map */
        //var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
        //    //position: london,
        //    element: popupContainer,
        //}));
        
        var view = new ol.View({
            center: london,
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
        


        
        var london = ol.proj.fromLonLat([-0.12755, 51.507222]);
}]);