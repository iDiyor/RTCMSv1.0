var app = angular.module('RTCMS', ['ngRoute', 
                                    // driver 
                                    'driverControllers', 
                                    'driverServices', 
                                    // vehicle
                                    'vehicleControllers', 
                                    'vehicleServices', 
                                    // map
                                    'mapControllers', 
                                    'mapServices']);

app.config(function ($routeProvider) {
    $routeProvider
   // route to main app page
   .when('/', {
        templateUrl: 'app/views/AppPage.html',
        controller: 'MainAppController'
    })
   .when('/driver', {
        templateUrl: 'app/views/DriverView.html',
        controller: 'DriverCtrl'
    })
   .when('/vehicle', {
        templateUrl: 'app/views/VehicleView.html',
        controller: 'VehicleCtrl'
    })
   .when('/map', {
        templateUrl: 'app/views/MapView.html',
        controller: 'MapCtrl'
    })
});

// Main/Admin tab
app.controller('MainAppController', function ($scope) {
    $scope.title = 'Main Tab';

    $scope.onTabClicked = function (tabId) {
        console.log(tabId);
    };
});
