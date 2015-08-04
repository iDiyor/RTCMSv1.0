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
        user
        .load(['userRole', 'userRole.userProfile'])
        .then(function (userWithUserRoleAndUserProfile) {
            
            var userRole = userWithUserRoleAndUserProfile.related('userRole');
            userRole
            .query('where', 'role', '=', req.body.role)
            .fetch({ require:true })
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
            //var token = jwt.sign(model, 'secretmessage', { expireInMinutes: 1440 });
            
            //res.json({
            //    responseStatus: 'success',
            //    responseBody: userData.related('userRole').toJSON() // token
            //});
        });
        // use user id to redirect to specific page or operation        
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