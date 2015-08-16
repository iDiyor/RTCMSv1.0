'use strict';

/* Services */

var mapServices = angular.module('mapServices', ['ngResource']);

//mapServices.factory('Location', ['$resource', '$http', function ($resource, $http) {
        
//        var services = {};
        
//        services.GetLocation = function (id_location, callback) {
//            $http.get('/api/maps/locations', {})
//            .success(function (res) {
//                callback(res);
//            })
//            .error(function (data, status) {
//                callback(data);
//            });
//        };

//        return services;
//}]);

mapServices.factory('Location', ['$resource', function ($resource) {
        return $resource('api/maps/locations/:id_location', {}, {
            get: { method: 'GET', params: { id_location: '@id_location' } },
            create: { method: 'POST' },
            update: { method: 'PUT' , params: { id_location: '@id_location' } },
            delete: { method: 'DELETE', params: { id_location: '@id_location' } }
        });
}]);

mapServices.factory('Direction', ['$resource', function ($resource) {
        return $resource('api/maps/directions/:id_direction', {}, {
            get: { method: 'GET', params: { id_direction: '@id_direction' } },
            create: { method: 'POST' },
            update: { method: 'PUT' , params: { id_direction: '@id_direction' } },
            delete: { method: 'DELETE', params: { id_direction: '@id_direction' } }
        });
}]);