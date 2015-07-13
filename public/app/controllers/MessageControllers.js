'use strict';

/* Controllers */

var messageControllers = angular.module('messageControllers', []);

messageControllers.controller('MessageCtrl', ['$scope', function ($scope) {
        
    $scope.title = 'Message View';    

        console.log('MessageControllers');    

    var socket = io.connect('http://localhost:1337');
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', {my: 'data'});
    });
}]); 