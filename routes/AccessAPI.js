'use strict'

var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var app = express();

var UserAccess = require('./../models/UserModel.js');
var UserProfile = require('./../models/UserProfileModel.js');
var Document = require('./../models/DocumentModel.js');

var User = UserAccess.User;
var UserRole = UserAccess.UserRole;
var UserStatus = UserAccess.UserStatus;

var SupportedUserType = ['admin', 'driver'];
var userType;

// checks username and login while sign in process
router.post('/authenticate', function (req, res) {
    /**
     * username
     * password
     * role
     */   
    User.forge({
        username: req.body.username,
        password: req.body.password
    })
    .fetch({ require: true }) // require true -> when forge parameters not match sends error
    .then(function (user) {
        if (req.body.role == 'driver') {
            user
            .load(['userRole', 'userRole.userProfile', 'userRole.userProfile.driverProfile']) // driverProfile added to be able to store in mobile app for using in Job Fragment
            .then(function (userWithUserRoleAndUserProfile) {
                
                var userRole = userWithUserRoleAndUserProfile.related('userRole');
                userRole
                .query('where', 'role', '=', req.body.role)
                .fetch({ require: true })
                .then(function (responseUserData) {
                    res.json({
                        responseStatus: 'success',
                        responseBody: responseUserData // token
                    });
                })
                .catch(function (error) {
                    res.status(500).json({
                        responseStatus: 'failure',
                        responseBody: {
                            message: error.message
                        }
                    });
                });
            });
        } else {
            user
            .load(['userRole', 'userRole.userProfile'])
            .then(function (userWithUserRoleAndUserProfile) {
                
                var userRole = userWithUserRoleAndUserProfile.related('userRole');
                userRole
                .query('where', 'role', '=', req.body.role)
                .fetch({ require: true })
                .then(function (responseUserData) {
                    res.json({
                        responseStatus: 'success',
                        responseBody: responseUserData // token
                    });
                })
                .catch(function (error) {
                    res.status(500).json({
                        responseStatus: 'failure',
                        responseBody: {
                            message: error.message
                        }
                    });
                });
            });
        }   
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

router.post('/registration', function (req, res) {
    // get username, password and user type from params
    // and save them accordingly userLogin - userType - driverTypeGroup/adminTypeGroup - driver/admin
    User.forge({
        username: req.body.username,
        password: req.body.password
    })
    .save(null, { method: 'insert' })
    .then(function (user) {
        // get the id and insert into userType
        insertNewUserRole(user, req.body.role, function (feedback) {
            res.json(feedback);
            console.log('registration success');
        });

    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

var insertNewUserRole = function (user, role, callback) {
    if (user) {
        UserRole.forge({
            role: role,
            id_user: user.get('id_user')
        })
        .save(null, { method: 'insert' })
        .then(function (userRole) {
            callback(userRole.toJSON());
        })
        .catch(function (error) {
            console.error(error);
        });
    }
};

function updateStatus(user, isActive, callback) {
    
}

module.exports = router;