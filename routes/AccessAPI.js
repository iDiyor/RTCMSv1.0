﻿'use strict'

var express = require('express');
var router = express.Router();

var Driver = require('./../models/DriverModel.js');
var Admin = require('./../models/AdminModel.js');
var UserAccess = require('./../models/UserAccessModel.js');

var UserLogin = UserAccess.UserLogin;
var UserType = UserAccess.UserType;
var DriverTypeGroup = UserAccess.DriverTypeGroup;
var AdminTypeGroup = UserAccess.AdminTypeGroup;
var ConnectionStatus = UserAccess.ConnectionStatus;

var SupportedUserType = ['admin', 'driver'];
var userType;

// checks username and login while sign in process
router.post('/authenticate', function (req, res) {
    UserLogin.forge({
        username: req.body.username,
        password: req.body.password
    })
    .fetch({ require: true }) // require true -> when forge parameters not match sends error
    .then(function (user) {
        
        // use user id to redirect to specific page or operation
        checkForUserType(user, function (data) {
            var resJSON = {
                responseStatus: 'success',
                responseBody: {
                    userName: data.userProfile.first_name,
                    userType: data.userType,
                    userProfile: data.userProfile
                }
            };
            res.json(resJSON);
        });
        
    })
    .catch(function(error) {
        res.status(500).json({
            responseStatus: 'failure',
            responseBody: {
                message: error.message
            }
        });
    });
    
});

router.post('/users', function (req, res) {
    // get username, password and user type from params
    // and save them accordingly userLogin - userType - driverTypeGroup/adminTypeGroup - driver/admin
    UserLogin.forge({
        username: req.body.username,
        password: req.body.password
    })
    .save(null, { method: 'insert' })
    .then(function (userLogin) {
        // get the id and insert into userType
        insertNewDriverIntoUserType(userLogin, function (feedback) {
            res.json(feedback);
        });

    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

var insertNewDriverIntoUserType = function (userLogin, callback) {
    if (userLogin) {
        UserType.forge({
            type: 'driver',
            id_user: userLogin.get('id_user')
        })
        .save(null, { method: 'insert' })
        .then(function (userType) {
            insertNewDriverIntoDriverTypeGroup(userType, function (feedback) {
                callback(feedback);
            });
        })
        .catch(function (error) {
            res.status(500).json({ error: true, data: { message: error.message } }); 
        });  
    }
}

var insertNewDriverIntoDriverTypeGroup = function (userType, callback) {
    if (userType) {
        DriverTypeGroup.forge({ id_user_type: userType.get('id_user_type') })
        .save(null, { method: 'insert' })
        .then(function (driverUserType) {
            callback(driverUserType);
        })
        .catch(function (error) {
            res.status(500).json({ error: true, data: { message: error.message } }); 
        });
    }
}

var checkForUserType = function(user, callback) {
    if (user) {
        UserType.forge({ id_user: user.get('id_user') })
        .fetch({ require: true })
        .then(function (userType) {
            fetchUserDataForUserType(userType, function (data) {
                callback(data);
            });
        })
        .catch(function (error) {
            console.error(error);
        });
    }
};

function updateConnectionStatus(user, isActive, callback) {
    
}

function fetchUserDataForUserType(userType, callback) {
    if (userType) {
        if (userType.get('type') == SupportedUserType[0]) { //admin
            AdminTypeGroup.forge({id_user_type: userType.get('id_user_type')})
            .fetch()
            .then(function (adminGroup) {
                getAdminDataByAdminGroupId(adminGroup, function (data) {
                    callback(data);
                });
            })
            .catch(function (error) {
                console.error(error);
            });
        }
        else if (userType.get('type') == SupportedUserType[1]) { //driver
            DriverTypeGroup.forge({id_user_type: userType.get('id_user_type')})
            .fetch()
            .then(function (driverGroup) {
                getDriverDataByDriverGroupId(driverGroup, function (data) {
                    callback(data);
                });
            })
            .catch(function (error) {
                console.error(error);
            });
        }
    }
}

function getDriverDataByDriverGroupId(driverGroup, callback) {
    if (driverGroup) {
        Driver.forge({id_driver_group: driverGroup.get('id_driver_group')})
        .fetch()
        .then(function (driver) {
            var driverData = {
                userType: 'driver',
                userProfile: driver.toJSON()
            };
            callback(driverData);
        })
        .catch(function (error) {
            console.error(error);
        });
    }
}

function getAdminDataByAdminGroupId(adminGroup, callback) {
    if (adminGroup) {
        Admin.forge({ id_admin: adminGroup.get('id_admin_group') })
        .fetch()
        .then(function (admin) {
            var adminData = {
                userType: 'admin',
                userProfile: admin.toJSON()
            };
            callback(adminData);
        })
        .catch(function (error) {
            console.error(error);
        });
    }
}

module.exports = router;