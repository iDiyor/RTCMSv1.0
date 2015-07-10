'use strict';

/* Controllers */

var mapControllers = angular.module('mapControllers', []);

mapControllers.controller('MapCtrl', ['$scope', 'Location', function ($scope, Location) {
        
        $scope.viewTitle = 'MapView';    

        var london = ol.proj.fromLonLat([-0.12755, 51.507222]);    

        /* Elements of popup */
        var popupContainer = document.getElementById('popup');
        var popupContent = document.getElementById('popup-content');
        var popupCloser = document.getElementById('popup-closer');
        
        /* Closes the popup */
        popupCloser.onclick = function () {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };
        
        /* An overlay to anchor the popup to the map */
        var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
            //position: london,
            element: popupContainer,
        }));
        
        var view = new ol.View({
            //center: london,
            zoom: 15
        });    
        

        // map
        var map = new ol.Map({
            layers: [
                new ol.layer.Tile({
                    preload: 4,
                    source: new ol.source.OSM()
                })
            ],
            overlays: [overlay],
            target: 'map',
            controls: ol.control.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                })
            }),
            view: view
        });    
        

        var locations = Location.query(function () {
            console.log(locations[0].longitude);

            var myLocation = ol.proj.fromLonLat([locations[0].longitude, locations[0].latitude]);   
           
            view.setCenter(myLocation);
            overlay.setPosition(myLocation);
           
            popupContainer.innerHTML = '<p>'+ locations[0].description +'</p>';
    
        });    
        


        
        var london = ol.proj.fromLonLat([-0.12755, 51.507222]);
}]);