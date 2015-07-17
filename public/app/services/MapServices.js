'use strict';

/* Services */

var mapServices = angular.module('mapServices', ['ngResource']);

mapServices.factory('Location', ['$resource', '$http', function ($resource, $http) {
        
        var services = {};
        
        services.GetLocation = function (id_location, callback) {
            $http.get('/api/maps/locations', {})
            .success(function (res) {
                callback(res);
            })
            .error(function (data, status) {
                callback(data);
            });
        };

        return services;
}]);
