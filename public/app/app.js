var app = angular.module('RTCMS', [/*'ngRoute',*/ 'ui.router', 
                                    // user access - login
                                    'userAccessControllers',
                                    'userAccessServices',
                                    // app controllers
                                    'appControllers',
                                    // driver 
                                    'driverControllers', 
                                    'driverServices', 
                                    // vehicle
                                    'vehicleControllers', 
                                    'vehicleServices', 
                                    // map
                                    'mapControllers', 
                                    'mapServices',
                                    // message
                                    'messageControllers']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    
        $stateProvider
        .state('login', {
            url: '/',
            templateUrl: 'app/views/LoginView.html',
            controller: 'UserAccessCtrl'
        })
        .state('app', {
            url: '/app',
            templateUrl: 'app/views/AppView.html',
            controller: 'AppCtrl'
        })
        .state('app.driver', { // app.driver - dot (.) loads html into ui-view inside AppView.html. Just 'driver' loads separate page of DriverView.html not nested
            url: '/driver',
            templateUrl: 'app/views/DriverView.html',
            controller: 'DriverCtrl'
        })
        .state('app.vehicle', {
            url: '/vehicle',
            templateUrl: 'app/views/VehicleView.html',
            controller: 'VehicleCtrl'
        })
        .state('app.map', {
            url: '/map',
            templateUrl: 'app/views/MapView.html',
            controller: 'MapCtrl'
        })
        .state('app.message', {
            url: '/message',
            templateUrl: 'app/views/MessageView.html',
            controller: 'MessageCtrl'
    });
        
        
    
    
    // $routeProvider
   //// login page
   //.when('/', {
   //     templateUrl: 'app/views/LoginView.html',
   //     controller: 'UserAccessCtrl'
   // })
   ////.when('/app', { // navigation bar on top of each page
   ////     templateUrl: 'app/views/NavigationView.html',
   ////     controller: 'NavigationCtrl'
   //// })
   //.when('/app', { // navigation bar on top of each page
   //     templateUrl: 'app/views/AppView2.html',
   //     controller: 'AppCtrl',
   // })
   //.when('/app/driver', {
   //     templateUrl: 'app/views/DriverView.html',
   //     controller: 'DriverCtrl'
   // })
   //.when('/app/vehicle', {
   //     templateUrl: 'app/views/VehicleView.html',
   //     controller: 'VehicleCtrl'
   // })
   //.when('/app/map', {
   //     templateUrl: 'app/views/MapView.html',
   //     controller: 'MapCtrl'
   // })
   //.when('/app/message', {
   //     templateUrl: 'app/views/MessageView.html',
   //     controller: 'MessageCtrl'
   // })
}]);

// Main/Admin tab
