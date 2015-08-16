'use strict';

/* Services */

var jobServices = angular.module('jobServices', ['ngResource']);

jobServices.factory('Job', ['$resource', function ($resource) {
        return $resource('api/jobs/:id_job', {}, {
            query: { method: 'GET', params: { id_job: '' }, isArray: true },
            get: { method: 'GET', params: { id_job: '' }, isArray: false },
            update: { method: 'PUT', params: {id_job: '@id_job' }, isArray: false },
            create: { method: 'POST' }, 
            delete: { method: 'DELETE', params: { id_job: '@id_job' } }
        });
 }]);

