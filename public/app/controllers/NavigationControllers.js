'use strict'

/* App Controllers */

var appControllers = angular.module('navigationControllers', []);

appControllers.controller('NavigationCtrl', ['$scope', function ($scope) {
        $scope.viewTitle = 'Navigation View';

}]);