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
    
    //Driver.forge({
    //    first_name: req.body.first_name,
    //    middle_name: req.body.middle_name,
    //    last_name: req.body.last_name,
    //    date_of_birth: req.body.date_of_birth,
    //    post_code: req.body.post_code,
    //    house_number: req.body.house_number,
    //    address_line_1: req.body.address_line_1,
    //    address_line_2: req.body.address_line_2,
    //    phone_number: req.body.phone_number,
    //    email: req.body.email,
    //    driving_licence_number: req.body.driving_licence_number,
    //    id_driver_group: req.body.id_driver_group
    //    //vehicle_registration_number_fk: req.body.vehicle_registration_number_fk,
    //})
    //.save(null, { method: 'insert' })
    //.then(function (driver) {
    //    res.json({ error: false, data: { id_driver: driver.get('id_driver') } });
    //})
    //.catch(function (error) {
    //    res.status(500).json({ error: true, data: { message: error.message } });
    //});
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
