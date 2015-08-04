'use strict';

var messageServices = angular.module('messageServices', ['ngResource']);

messageServices.factory('Message', ['$resource', '$http', function ($resource, $http) {
        var services = {};

        services.MessagesTo = function (to_id_user_profile, from_id_user_profile, callback) {
            $http.post('/api/messages/user', { to_id_user_profile: to_id_user_profile, from_id_user_profile: from_id_user_profile })
            .success(function (res) {
                callback(res);
            })
            .error(function (res, status) {
                callback(res);
            });
        };

        return services;
}]);