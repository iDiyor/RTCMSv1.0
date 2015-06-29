'use strict';

/* Controllers */

var adminController = angular.module('adminControllers', []);

// Admin tab
adminController.controller('AdminCtrl', ['$scope', 'Admin', 
    function ($scope, Admin) {
        $scope.drivers = Admin.query();
        
        $scope.title = 'Admin Tab';

        $scope.onEditButtonClicked = function (data) {
            console.log('Edit Button Clicked');
            $('#editModalDialog').modal('show');
        };

}]);