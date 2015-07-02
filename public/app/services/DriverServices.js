'use strict';

/* Services */

var adminServices = angular.module('driverServices', ['ngResource']);

adminServices.factory('Driver', ['$resource', function ($resource) {
        return $resource('api/:driverId', {}, {
            query: { method: 'GET', params: { driverId: 'drivers' }, isArray: true }
        });
    }]);




//create a service
// add the service to the app
// try to make http requests and get response (json)
// table 