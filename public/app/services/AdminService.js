'use strict';

var adminServices = angular.module('adminServices', []);

adminServices.factory('AdminService', [function () {
        var adminProfile;
        
        var services = {};

        services.SetProfile = function (profile) {
            adminProfile = profile;
        }

        services.GetProfile = function () {
            if (adminProfile) {
                return adminProfile;
            }
        }

        return services;
}]);