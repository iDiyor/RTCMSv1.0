'use strict';

var express = require('express');
var router = express.Router();

//var bookshelf = require('./../models/BookshelfConnector');
var Driver = require('./../models/DriverModel.js');

// get all drivers list
router.get('/', function (req, res) {
    //Driver.forge()
    //.fetchAll()
    //.then(function (driverCollection) {
    //    res.json(driverCollection.toJSON());
    //})
    //.catch(function (error) {
    //    console.log(error);
    //    res.send('An error occured');
    //});
    
    Driver.forge()
    .fetchAll()
    .then(function (driver) {
        driver
        .load(['vehicle'])
        .then(function (model) {
            res.json(model.toJSON());
        });
        
    })
    .catch(function (error) {
        console.log(error);
        res.send('An error occured');
    });
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

module.exports = router;
