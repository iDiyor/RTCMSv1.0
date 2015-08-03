'use strict';

/* Services */

var driverServices = angular.module('driverServices', ['ngResource']);

driverServices.factory('Driver', ['$resource', function ($resource) {
        return $resource('api/drivers/:id_driver', {}, {
            query: { method: 'GET', params: { id_driver: '' }, isArray: true },
            get: { method: 'GET', params: { id_driver: '@id_driver' }, isArray: false },
            update: { method: 'PUT', params: { id_driver: '@id_driver' }, isArray: false},
            create: { method: 'POST' }, 
            delete: { method: 'DELETE', params: { id_driver: '@id_driver' }, isArray: false }
        });
}]);




//create a service
// add the service to the app
// try to make http requests and get response (json)
// table 