'use strict';

var express = require('express');
var async = require('async');
var router = express.Router();

var UserProfile = require('./../models/UserProfileModel.js');
var UserAccess = require('./../models/UserAccessModel.js');
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
        //driving_licence_number: req.body.driving_licence_number,
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
    Driver.forge({ id_driver: req.params.id_driver })      
   .fetch()
   .then(function (driverData) {
        res.json(driverData.toJSON());
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
        // get user profile(destroy) <- get user role (destroy) <- get user (destroy)
        //driverProfile.destroy();

        async.waterfall([
            // destroy Document
            function (callback) {
                Document.forge({ id_driver: driverProfile.get('id_driver') })
                .fetch({ require: true })
                .then(function (document) {
                    var id_user_profile = driverProfile.get('id_user_profile');
                    document.destroy();
                    driverProfile.destroy();

                    callback(null, id_user_profile);
                });
            },
            //Destroy UserProfile
            /**
             * arg1 - id_user_profile
             */
            function (arg1, callback) {
                UserProfile.forge({ id_user_profile: arg1 })
                .fetch({ require: true })
                .then(function (userProfile) {
                    // pass id_role to destroy
                    var id_role = userProfile.get('id_role');
                    userProfile.destroy();
                    callback(null, id_role);
                })
                .catch(function (error) {
                    callback(error);
                });
            },
            // Destroy UserRole
            /**
             * arg1 - id_role
             */
            function (arg1, callback) {
                UserRole.forge({ id_role: arg1 })
                .fetch()
                .then(function (userRole) {
                    var id_user = userRole.get('id_user');
                    userRole.destroy();
                    callback(null, id_user);
                })
                .catch(function (error) {
                    callback(error);
                });
            },
            // Destroy User
            /**
             * arg1 - id_user
             */
            function (arg1, callback) {
                User.forge({ id_user: arg1 })
                .fetch()
                .then(function (user) {
                    console.log(user);
                    user.destroy();
                    callback(null, 'driver record deleted');
                })
                .catch(function (error) {
                    callback(error);
                });
            }
        ],
            function (error, result) {
            if (error) {
                res.status(500).json({ error: true, data: { message: error.message } });
                return;
            }

            res.json({ responseStatus: result });
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
    
    
   // Driver.forge({ id_driver: req.params.id_driver })
   //.fetch({ require: true })
   //.then(function (driverData) {
   //     driverData.destroy();
   //     res.json({ message: 'Driver successfully deleted' });
   // })
   // .catch(function (error) {
   //     res.status(500).json({ error: true, data: { message: error.message } });
   // });
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
