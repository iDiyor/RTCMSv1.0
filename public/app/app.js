var app = angular.module('RTCMS', ['ngRoute', 'driverControllers', 'driverServices', 'vehicleControllers', 'vehicleServices']);

app.config(function ($routeProvider) {
    $routeProvider
   // route to main app page
   .when('/', {
        templateUrl: 'app/views/AppPage.html',
        controller: 'MainAppController'
    })
   .when('/driver', {
        templateUrl: 'app/views/DriverPage.html',
        controller: 'DriverCtrl'
    })
   .when('/vehicle', {
        templateUrl: 'app/views/VehiclePage.html',
        controller: 'VehicleCtrl'
    })
   .when('/map', {
        templateUrl: 'app/views/MapPage.html',
        controller: 'MapController'
    })
});

// Main/Admin tab
app.controller('MainAppController', function ($scope) {
    $scope.title = 'Main Tab';

    $scope.onTabClicked = function (tabId) {
        console.log(tabId);
    };
});


// Map tab
app.controller('MapController', function ($scope) {
    $scope.title = 'Map Tab';
});