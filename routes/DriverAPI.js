'use strict';

var express = require('express');
var async = require('async');
var router = express.Router();

var UserProfile = require('./../models/UserProfileModel.js');
var UserAccess = require('./../models/UserAccessModel.js');
var Document = require('./../models/DocumentModel.js');

var DriverProfile = require('./../models/DriverProfileModel.js');

var UserRole = UserAccess.UserRole;


// get all drivers list
router.get('/', function (req, res) {
    var drivers = [];

    DriverProfile.forge()
    .fetchAll()
    .then(function (driverProfiles) {
        // async
        async.eachSeries(driverProfiles.toJSON(), function (driverProfile, callback) {
            // user profile
            UserProfile.forge({ id_user_profile: driverProfile.id_user_profile })
                .fetch( { require: true } )
                .then(function (userProfile) {
                // get document
                getDocumentForUserProfile(driverProfile, function (document) {
                    // build json response
                    var jsonData = {
                        driverProfile: userProfile,
                        driverDocument: document
                    };
                    drivers.push(jsonData);
                    callback();
                });
                   
            })
            .catch(function (error) {
                callback(error);
            });
        },
        function (error) {
            if (error) res.status(500).json({ error: true, data: { message: error.message } });;
            
            res.json(drivers); 
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });

        


        
    //async.waterfall([
    //    //load driver profile
    //    function (callback) {
    //        DriverProfile.forge()
    //        .fetchAll()
    //        .then(function (driverProfile) {

    //            callback(null, driverProfile.toJSON());
    //        })
    //        .catch(function (error) {
    //            callback(error);
    //        });
    //    },
    //    // load user profile
    //    // arg1 - DriverProfile
    //    function (arg1, callback) {
    //        var drivers = [];
    //        // loop throug each driver profiles and fetch user profiles 
    //        async.each(arg1, function (driverProfile, lowCallback) {
    //            // user profile
    //            UserProfile.forge({ id_user_profile: driverProfile.id_user_profile })
    //            .fetch()
    //            .then(function (userProfile) {
    //                var jsonData = null;
    //                // get document
    //                getDocumentForUserProfile(driverProfile, function (document) {
    //                    // build json response
    //                    jsonData = {
    //                        driverProfile: userProfile,
    //                        driverDocument: document
    //                    };
    //                    drivers.push(jsonData);
    //                    lowCallback();
    //                });
                   
    //            })
    //            .catch(function (error) {
    //                callback(error);
    //            });
    //        }, 
    //        function (error) {
    //            callback(error, drivers); 
    //        });
    //    }
    //],
    //function (error, results) {
    //    if (error) res.status(500).json({ error: true, data: { message: error.message } });
    //    // all tasks are done and response = 200
    //    res.json(results);
    //});
});

// create a new driver and insert into the database
router.post('/', function (req, res) {
    Driver.forge({
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
        driving_licence_number: req.body.driving_licence_number,
        id_driver_group: req.body.id_driver_group
        //vehicle_registration_number_fk: req.body.vehicle_registration_number_fk,
    })
    .save(null, { method: 'insert' })
    .then(function (driver) {
        res.json({ error: false, data: { id_driver: driver.get('id_driver') } });
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
    
    Driver.forge({ id_driver: req.params.id_driver })
    .fetch()
    .then(function (driver) {
        driver.save({
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
            driving_licence_number: req.body.driving_licence_number,
            //vehicle_registration_number_fk: req.body.vehicle_registration_number_fk,
        })
        .then(function () {
            res.json({ error: false, message: 'Record updated' });
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

// delete a driver from database
router.delete('/:id_driver', function (req, res) {
    Driver.forge({ id_driver: req.params.id_driver })
   .fetch({ require: true })
   .then(function (driverData) {
        driverData.destroy();
        res.json({ message: 'Driver successfully deleted' });
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
