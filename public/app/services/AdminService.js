'use strict';

var adminServices = angular.module('adminServices', ['ngResource']);

adminServices.service('AdminService', ['$resource', function ($resource) {
        return $resource('/api/admin/:id_admin', {}, {
            query: { method: 'GET', params: { id_admin: '' }, isArray: true },
            get: { method: 'GET', params: { id_admin: '@id_admin' } },
            update: { method: 'PUT', params: { id_admin: '@id_admin' } }, 
            create: { method: 'POST' },
            delete: { method: 'DELETE', params: { id_admin: '@id_admin' } }
        });
}]);