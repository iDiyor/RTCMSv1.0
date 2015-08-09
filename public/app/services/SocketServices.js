'use strict'

var socketIOServices = angular.module('socketServices', []);

socketIOServices.factory('Socket', ['$rootScope', function ($rootScope) {
        var socket = io.connect('http://52.28.143.209:3000');
        
        socket.on('connect', function () {
            var client = {
                name: 'jeb',
                type: 'web'
            };

            socket.emit('client:connection', client);
        });
        
        socket.on('disconnect', function () {
            var client = {
                name: 'jeb',
                type: 'web'
            };
            
            socket.emit('client:disconnect', client);
        });

        var services = {};
        
        services.On = function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        };

        return services;
}]);