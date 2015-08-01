'use strict'

/* App controllers */
var appControllers = angular.module('appControllers', []);

appControllers.controller('AppCtrl', ['$scope', '$location',function ($scope, $location) {

        $scope.viewTitle = 'App View';
        

        $location.path('app/driver');

        $scope.username = 'Diyor';

        

}]);