'use strict';

/* Services */

var vehicleServices = angular.module('vehicleServices', ['ngResource']);

vehicleServices.factory('Vehicle', ['$resource', function ($resource) {
        return $resource('api/vehicles/:id_registration_number', {} ,{
            query: { method: 'GET', params: { id_registration_number: '' }, isArray: true },
            get: { method: 'GET', params: { id_registration_number: '@id_registration_number' }, isArray: false },
            update: { method: 'PUT', params: { id_registration_number: '@id_registration_number' } },
            create: { method: 'POST' }, 
            delete: { method: 'DELETE', params: { id_registration_number: '@id_registration_number' } }
        });
}]);