'use strict';

var geolocationServices = angular.module('geolocationServices', ['ngResource']);

geolocationServices.factory('PostcodeLookupService', ['$resource', function ($resource) {
        return $resource('https://api.postcodes.io/postcodes/:postcode', {}, {
            get: { method: 'GET', params: { postcode: '@postcode' } }
        });
}]);