'use strict'

var socketIOServices = angular.module('socketServices', []);

socketIOServices.factory('Socket', ['$rootScope', '$q' , function ($rootScope, $q) {

        var socket = io.connect('http://52.28.143.209:3000', { 'forceNew': true, 'reconnection': true });
        

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
        
        services.Off = function (eventName, callback) {
            socket.off(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        };
        
        services.Emit = function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        };
        
        services.Disconnect = function () {
            socket.disconnect();   
        }

        return services;
}]);