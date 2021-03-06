﻿'use strict';

var express = require('express');
var async = require('async');
var router = express.Router();


var UserProfile = require('./../models/UserProfileModel.js');
var UserAccess = require('./../models/UserModel.js');
var Document = require('./../models/DocumentModel.js');

var DriverProfile = require('./../models/DriverProfileModel.js');

var User = UserAccess.User;
var UserRole = UserAccess.UserRole;


// get all drivers list
router.get('/', function (req, res) {

    DriverProfile.forge()
    .fetchAll()
    .then(function (driverProfiles) {
        
        driverProfiles
        .load(['vehicle', 'document', 'userProfile'])
        .then(function (driverProfilesWithVehicle) {
            res.json(driverProfilesWithVehicle.toJSON());
        })
        .catch(function (error) {
            console.error(error);
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

// create a new driver and insert into the database
router.post('/', function (req, res) {
    UserProfile.forge({
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        date_of_birth: req.body.date_of_birth,
        post_code: req.body.post_code,
        house_number: req.body.house_number,
        address_line_1: req.body.address_line_1,
        address_line_2: req.body.address_line_2,
        phone_number: req.body.phone_number,
        email: req.body.email,
        id_role: req.body.id_role
    })
    .save(null, { method: 'insert' })
    .then(function (userProfile) {
        // async waterfall
        async.waterfall([
            // insert a driver
            function (callback) {
                DriverProfile.forge({ id_user_profile: userProfile.get('id_user_profile') })
                .save(null, { method: 'insert' })
                .then(function (driverProfile) {
                    callback(null, driverProfile.toJSON());
                })
                .catch(function (error) {
                    callback(error);           
                });
            },
            // insert a document
            function (arg1, callback) {
                Document.forge({
                    driving_licence_number: req.body.driving_licence_number,
                    id_driver: arg1.id_driver
                })
                .save(null, { method: 'insert' })
                .then(function (document) {
                    callback(null, 'success');
                    console.log('success driver');
                })
                .catch(function (error) {
                    callback(error);
                });                 
            }
        ], 
        function (error, result) {
            if (error) res.status(500).json({ error: true, data: { message: error.message } });

            res.json(result);
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

// get a driver by id
router.get('/:id_driver', function (req, res) {
    /* req.params - An object containing properties mapped to the named route “ parameters”.For example, 
    if youhavethe route /user/:name, thenthe“name” property is available as req.params.name.
    This object defaults to { }.*/

    DriverProfile.forge({ id_driver: req.params.id_driver })
    .fetch()
    .then(function (driverProfile) {
        driverProfile
        .load(['vehicle', 'document', 'userProfile'])
        .then(function (model) {
            res.json(model.toJSON());
        })
        .catch(function (error) {
            console.error(error);
        });
  
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });

});

router.put('/:id_driver', function (req, res) {
    
    DriverProfile.forge({ id_driver: req.params.id_driver })
    .fetch()
    .then(function (driverProfile) {
        // async parallel
        async.parallel([
            // update user profile
            function (callback) {
                UserProfile.forge({ id_user_profile: driverProfile.get('id_user_profile') })
                .fetch()
                .then(function (userProfile) {
                    userProfile
                    .save({
                        first_name: req.body.first_name,
                        middle_name: req.body.middle_name,
                        last_name: req.body.last_name,
                        date_of_birth: req.body.date_of_birth,
                        post_code: req.body.post_code,
                        house_number: req.body.house_number,
                        address_line_1: req.body.address_line_1,
                        address_line_2: req.body.address_line_2,
                        phone_number: req.body.phone_number,
                        email: req.body.email
                    })
                    .then(function () {
                        callback(null, 'user profile successfully updated');
                    })
                })
                .catch(function (error) {
                    callback(error);
                });
            },

            // update documents
            function (callback) {
                Document.forge({ id_driver: driverProfile.get('id_driver') })
                .fetch()
                .then(function (document) {
                    document
                    .save({
                        driving_licence_number: req.body.driving_licence_number
                    })
                    .then(function () {
                        callback(null, 'document successfully updated');
                    });
                })
                .catch(function (error) {
                    callback(error);
                })
            }
        ],
            function (error, results) {
            
            if (error) res.status(500).json({ error: true, data: { message: error.message } });
            
            res.json({ responseStatus: 'success'});

        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

// delete a driver from database
router.delete('/:id_driver', function (req, res) {

    DriverProfile.forge({ id_driver: req.params.id_driver })
    .fetch({ require: true })
    .then(function (driverProfile) {

        driverProfile.load(['document', 'vehicle', 'userProfile', 'userProfile.userRole', 'userProfile.userRole.user'])
        .then(function (driverWithUserProfile) {
            
            var document = driverWithUserProfile.related('document');
            if (document) {
                document.destroy()
                .then(function (driverProfileWithoutDocument) {
                    var vehicle = driverProfileWithoutDocument.related('vehicle');
                    if (vehicle) {
                        vehicle.destroy()
                        .then(function (driverProfileWithoutVehicle) {
                            driverWithUserProfile.destroy()
                            .then(function (userProfile) {
                                userProfile.related('userProfile').destroy()
                                .then(function (userRole) {
                                    userRole.related('userRole').destroy()
                                    .then(function (user) {
                                        user.related('user').destroy()
                                        .then(function (result) {
                                            res.json({
                                                responseTitle: 'Removing the record from the database',
                                                responseStatus: 'success',
                                                responseBody: result.toJSON()
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    } else {
                        driverWithUserProfile.destroy()
                        .then(function (userProfile) {
                            userProfile.related('userProfile').destroy()
                            .then(function (userRole) {
                                userRole.related('userRole').destroy()
                                .then(function (user) {
                                    user.related('user').destroy()
                                    .then(function (result) {
                                        res.json({
                                            responseTitle: 'Removing the record from the database',
                                            responseStatus: 'success',
                                            responseBody: result.toJSON()
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            }

        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});


// fetch documents if available for that user
var getDocumentForUserProfile = function (driverProfile, callback) {
    if (driverProfile) {
        Document.forge({ id_driver: driverProfile.id_driver })
        .fetch({ require: true })
        .then(function (document) {
            callback(document.toJSON());
        })
        .catch(function (error) {
            console.error(error);
        });
    }
}

module.exports = router;
