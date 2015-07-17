﻿'use strict';

/* Controllers */

var messageControllers = angular.module('messageControllers', []);

messageControllers.controller('MessageCtrl', ['$scope', function ($scope) {
        
    $scope.title = 'Message View';    

        console.log('MessageControllers');    

    var socket = io.connect('http://52.28.143.209:3000/');
        
    //var socket = io.connect('http://localhost:3000/');
    socket.on('server:message', function (data) {
        console.log(data);
        socket.emit('my other event', {my: 'data'});
        });
}]); 