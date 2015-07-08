'use strict';

/* Controllers */

var mapControllers = angular.module('mapControllers', []);

mapControllers.controller('MapCtrl', ['$scope', function ($scope) {

        $scope.viewTitle = 'MapView';
        
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
            element: popupContainer,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        }));

        
        
        
        var london = ol.proj.fromLonLat([-0.12755, 51.507222]);
        var myLocation = ol.proj.fromLonLat([-0.237145, 51.749048]);

        var view = new ol.View({
            center: myLocation,
            zoom: 15
        });

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
        
        popupContainer.innerHTML = '<p>My Location</p>';
        overlay.setPosition(myLocation);
}]);