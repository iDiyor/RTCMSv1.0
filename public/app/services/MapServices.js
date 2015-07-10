'use strict';

/* Services */

var mapServices = angular.module('mapServices', ['ngResource']);

mapServices.factory('Location', ['$resource', function ($resource) {
        return $resource('api/maps/locations/:id_location', {}, {
            query: { method: 'GET', params: { id_location: '' }, isArray: true }

        });
}]);
