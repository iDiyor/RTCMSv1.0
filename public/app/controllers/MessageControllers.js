'use strict';

/* Controllers */

var messageControllers = angular.module('messageControllers', ['driverServices']);

messageControllers.controller('MessageCtrl', ['$scope', '$stateParams', '$state', 'Driver', function ($scope, $stateParams, $state, Driver) {
        $scope.drivers = Driver.query();    

        $scope.goSomewhere = function (index) {
            $state.go('app.message.compose', { id_driver: $scope.drivers[index].id_driver });
        }
}]);

messageControllers.controller('MessageComposeCtrl', ['$scope', '$stateParams', 'Driver', function ($scope, $stateParams, Driver) {
        
        $scope.driver = Driver.get({ id_driver: $stateParams.id_driver });

        $scope.title = 'Message View';
        
        console.log('MessageInboxControllers');

}]);
