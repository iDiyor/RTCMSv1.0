﻿'use strict'

/* User access service - Login */

var userAccessServices = angular.module('userAccessServices', ['ngResource']);

userAccessServices.factory('UserAuthenticateService', ['$resource', '$http', function ($resource, $http) {
        var services = {};

        services.Authenticate = function (username, password, role, callback) {
            $http.post('/api/user/authenticate', { username: username, password: password, role: role })
            .success(function (res) {
                callback(res);
            })
            .error(function (data, status) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
                callback(data); // server - REST API response with 500 HTTP status
            });
        };
        
        services.UserRegistration = function (username, password, role, callback) {
            $http.post('/api/user/registration', { username: username, password: password , role: role})
            .success(function (res) {
                callback(res);
            })
            .error(function (data, status) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                callback(data); // server - REST API response with 500 HTTP status
            });
        };
       
        return services;
}]);