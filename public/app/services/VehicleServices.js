'use strict';

/* Services */

var vehicleServices = angular.module('vehicleServices', ['ngResource']);

vehicleServices.factory('Vehicle', ['$resource', function ($resource) {
        return $resource('api/vehicles/:registration_number', {} ,{
            query: { method: 'GET', params: { registration_number: '' }, isArray: true },
            get: { method: 'GET', params: { registration_number: '@registration_number' }, isArray: false },
            update: { method: 'PUT', params: { registration_number: '@registration_number'} }
        });
}]);