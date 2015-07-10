'use strict';

var express = require('express');
var router = express.Router();

//var bookshelf = require('./../models/BookshelfConnector');
var Vehicle = require('./../models/VehicleModel.js');

//var Vehicle = bookshelf.Model.extend( {
//    tableName: 'vehicle',
//    idAttribute: 'registration_number' // this line helped to implement update(HTTP->PUT) of a record
//    //vehicle : function () {
//    //    return this.belongsTo(Driver
//    //};
//});

// get a list of all vehicles
router.get('/', function (req, res) {
    //Vehicle.forge()
    //.fetchAll()
    //.then(function (vehicle) {
    //    res.json(vehicle.toJSON());
    //})
    //.catch(function (error) {
    //    console.log(error);
    //    res.send('An error occuered while retrieving vehicles data');
    //});
    // #2
    //Vehicle.forge()
    //.fetch({ withRelated: ['driver'] })
    //.then(function (data) {
    //    res.json(data.related('driver'));
    //});

    //#3
    Vehicle.forge()
    .fetchAll()
    .then(function (vehicle) {
        vehicle
        .load(['driver'])
        .then(function (model) {
            res.json(model.toJSON());
        });
    });

});

// creates a new vehicle
router.post('/', function (req, res) {
    
    Vehicle.forge({
        id_registration_number: req.body.id_registration_number,
        make: req.body.make,
        model: req.body.model,
        passenger_seat_number: req.body.passenger_seat_number,
        id_driver: req.body.id_driver
    })
    .save(null, { method: 'insert' })
    .then(function (vehicle) {
        res.json({ error: false, data: { id_registration_number: vehicle.get('id_registration_number') } });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

// get a vehicle by reg number
router.get('/:id_registration_number', function (req, res) {
    /* req.params - An object containing properties mapped to the named route “ parameters” .For example, 
    if you have the route /user/:name, then the “name” property is available as req.params.name.
    This object defaults to { }.*/
    Vehicle.forge({ id_registration_number: req.params.id_registration_number })
   .fetch()
   .then(function (vehicle) {
        res.json(vehicle.toJSON());
    })
   .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    }); 
});

// put/update a vehicle by reg number
router.put('/:id_registration_number', function (req, res) {
    /* req.params - An object containing properties mapped to the named route “ parameters” .For example, 
    if you have the route /user/:name, then the “name” property is available as req.params.name.
    This object defaults to { }.*/
   
    Vehicle.forge({ id_registration_number : req.params.id_registration_number })
   .fetch()
   .then(function (vehicle) {
        vehicle.save({
            make: req.body.make, 
            model: req.body.model,
            passenger_seat_number: req.body.passenger_seat_number,
            id_driver: req.body.id_driver
        })
        .then(function () {
            res.json({ error: false, message: 'Record updated' });
        });                    
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    }); 
});

router.delete('/:id_registration_number', function (req, res) {
    
    // pay attention to req.body and req.params
    Vehicle.forge({ id_registration_number: req.params.id_registration_number })
    .fetch({ require: true })
    .then(function (vehicle) {
        vehicle.destroy()
        .then(function () {
            res.json({ error: false, data: { message: 'Vehicle has successfuly deleted' } });
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    }); 
});

module.exports = router;

