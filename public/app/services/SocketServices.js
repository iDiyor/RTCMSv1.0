'use strict'

var socketIOServices = angular.module('socketServices', []);

socketIOServices.factory('Socket', ['$rootScope', function ($rootScope) {
        var socket = io.connect('http://52.28.143.209:3000');
        
        var services = {};
        
        services.On = function (eventName, callback) {
            socket.on(eventName, function (data) {
                $rootScope.$apply(function () {
                    callback.apply(socket, data);
                });
            });
        };

        return services;
}]);