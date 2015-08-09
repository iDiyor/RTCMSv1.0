'use strict'

var socketIOServices = angular.module('socketServices', []);

socketIOServices.factory('Socket', ['$rootScope', '$q' , function ($rootScope, $q) {
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
        
        //services.On = function (eventName, callback) {
        //    var defer = $q.defer();

        //    socket.on(eventName, function (data) {
        //        defer.resolve(data);
                
        //        //var args = arguments;
        //        //$rootScope.$apply(function () {
        //            //callback.apply(socket, args);
        //        //});
        //    });
        //};
        services.On = function (eventName) {
            var defer = $q.defer();
            
            socket.on(eventName, function (data) {
                defer.resolve(data); 
            });

            return defer.promise;
        }
        
        services.Off = function (eventName, callback) {
            socket.off(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        };
        
        services.Disconnect = function () {
            socket.disconnect();   
        }

        return services;
}]);