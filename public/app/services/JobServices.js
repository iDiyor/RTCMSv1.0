'use strict';

/* Services */

var jobServices = angular.module('jobServices', ['ngResource']);

//jobServices.factory('Job', ['$resource', function ($resource) {
//        return $resource('api/jobs/:id_driver', {}, {
//            query: { method: 'GET', params: { id_driver: '' }, isArray: true },
//            get: { method: 'GET', params: { id_driver: '@id_driver' }, isArray: false },
//            update: { method: 'PUT', params: { id_driver: '@id_driver' }, isArray: false },
//            create: { method: 'POST' }, 
//            delete: { method: 'DELETE', params: { id_driver: '@id_driver' } }
//        });
// }]);

