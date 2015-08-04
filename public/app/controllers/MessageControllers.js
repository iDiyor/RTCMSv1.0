'use strict';

/* Controllers */

var messageControllers = angular.module('messageControllers', ['driverServices', 'messageServices']);

messageControllers.controller('MessageCtrl', ['$scope', '$stateParams', '$state', 'Driver', function ($scope, $stateParams, $state, Driver) {
        // should be an array of online drivers only
        $scope.onlineDrivers = Driver.query();    

        $scope.goSomewhere = function (index) {
            $state.go('app.message.compose', { id_driver: $scope.onlineDrivers[index].id_driver });
        }
}]);

messageControllers.controller('MessageComposeCtrl', ['$scope', '$stateParams', 'Driver', 'Message', function ($scope, $stateParams, Driver, Message) {
       
        Driver.get({ id_driver: $stateParams.id_driver }, function (res) {
            var fromUser = res.id_user_profile;

            $scope.messages = Message.MessagesTo(1, fromUser, function (res) {
                $scope.messages = res;
            });
        });
       
}]);
