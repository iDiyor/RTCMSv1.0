'use strict';

/* Services */

var adminServices = angular.module('adminServices', ['ngResource']);

adminServices.factory('Admin', ['$resource',
    function ($resource) {
        return $resource('api/:driverId', {}, {
            query: { method: 'GET', params: { driverId: 'drivers' }, isArray: true }
        });
    }]);




//create a service
// add the service to the app
// try to make http requests and get response (json)
// table 