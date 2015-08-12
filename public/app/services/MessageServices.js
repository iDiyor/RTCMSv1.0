'use strict';

var messageServices = angular.module('messageServices', ['ngResource']);

messageServices.factory('Message', ['$resource', function ($resource) {
        return $resource('api/messages/:to_id_user_profile/:from_id_user_profile', {}, {
            query: { method: 'GET', params: { to_id_user_profile: '', from_id_user_profile: '' }, isArray: true },
            getMessageToFrom: { method: 'GET', params: { to_id_user_profile: '', from_id_user_profile: '' }, isArray: true },
            addMessageTo: { method: 'POST', params: { to_id_user_profile: '', from_id_user_profile: '' } },

        });
}]);