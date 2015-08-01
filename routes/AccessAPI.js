'use strict'

var express = require('express');
var router = express.Router();

var UserAccess = require('./../models/UserAccessModel.js');
var UserProfile = require('./../models/UserProfile.js');
var Document = require('./../models/DocumentModel.js');

var User = UserAccess.User;
var UserRole = UserAccess.UserRole;
var UserStatus = UserAccess.UserStatus;

var SupportedUserType = ['admin', 'driver'];
var userType;

// checks username and login while sign in process
router.post('/authenticate', function (req, res) {
    User.forge({
        username: req.body.username,
        password: req.body.password
    })
    .fetch({ require: true }) // require true -> when forge parameters not match sends error
    .then(function (user) {
        
        // use user id to redirect to specific page or operation
        checkForUserRole(user, function (data) {
            var resJSON = {
                responseStatus: 'success',
                responseBody: data
                    //userName: data.userProfile.first_name,
                    //userType: data.userType,
                    //userProfile: data.userProfile
                //}
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

var checkForUserRole = function (user, callback) {
    if (user) {
        UserRole.forge({ id_user: user.get('id_user') })
        .fetch({ require: true })
        .then(function (userRole) {
            getUserProfileForUserRole(userRole, function (feedback) {
                callback(feedback);
            });
        })
        .catch(function (error) {
            console.error(error);
        }); 
    }   
}
var getUserProfileForUserRole = function (userRole, callback) {
    if (userRole) {
        UserProfile.forge({ id_role: userRole.get('id_role') })
        .fetch({ require: true })
        .then(function (userProfile) {
            if (userRole.get('role') == 'driver') { // create a json for driver role user and fetch other data required for this type of user profile (driving licence, ...)
                getDocumentForUserProfile(userProfile, function (feedback) {
                    var json = {
                        userRole: 'driver',
                        userProfile: userProfile,
                        document: feedback
                    };
                    callback(json);
                });
            }
            else if (userRole.get('role') == 'admin') { // create a json for admin role user
                var json = {
                    userRole: 'admin',
                    userProfile: userProfile,
                    document: null
                };
                callback(json);
            }
        })
        .catch(function (error) {
            console.error(error);
        });
    }
}

// fetch documents if available for that user
var getDocumentForUserProfile = function (userProfile, callback) {
    if (userProfile) {
        Document.forge({ id_user_profile: userProfile.get('id_user_profile') })
        .fetch({ require: true })
        .then(function (document) {
            callback(document);
        })
        .catch(function (error) {
            console.error(error);
        });
    }   
}


function updateStatus(user, isActive, callback) {
    
}

module.exports = router;