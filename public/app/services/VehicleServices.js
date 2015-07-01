'use strict';

/* Services */

var vehicleServices = angular.module('vehicleServices', ['ngResources']);

vehicleServices.factory('Vehicle', ['$resource', function ($resource) {
        return $resource('api/:vehicleId', {} , {
            query: { method: 'GET', params: { vehicleId: 'vehicles' }, isArray: true }
        });
}]);