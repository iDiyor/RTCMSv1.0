var express = require('express');
var router = express.Router();

var bookshelf = require('./bookshelfRTCMS.js');

var Vehicle = bookshelf.Model.extend({
    tableName: 'vehicle',
    idAttribute: 'registration_number' // this line helped to implement update(HTTP->PUT) of a record
});


// get a list of all vehicles
router.get('/', function (req, res) {
    Vehicle.forge()
    .fetchAll()
    .then(function (vehicleCollection) {
        res.json(vehicleCollection.toJSON());
    }).catch(function (error) {
        console.log(error);
        res.send('An error occuered while retrieving vehicles data');
    });
});

// creates a new vehicle
router.post('/', function (req, res) {
    
    Vehicle.forge({
        registration_number: req.body.registration_number,
        make: req.body.make,
        model: req.body.model,
        passenger_seat_number: req.body.passenger_seat_number
    })
    .save(null, { method: 'insert' })
    .then(function (vehicle) {
        res.json({ error: false, data: { registration_number: vehicle.get('registration_number') } });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

// get a vehicle by reg number
router.get('/:registration_number', function (req, res) {
    /* req.params - An object containing properties mapped to the named route “ parameters” .For example, 
    if you have the route /user/:name, then the “name” property is available as req.params.name.
    This object defaults to { }.*/
    Vehicle.forge({ registration_number: req.params.registration_number })
   .fetch()
   .then(function (vehicleData) {
        res.json(vehicleData.toJSON());
    });
});

// put/update a vehicle by reg number
router.put('/:registration_number', function (req, res) {
    /* req.params - An object containing properties mapped to the named route “ parameters” .For example, 
    if you have the route /user/:name, then the “name” property is available as req.params.name.
    This object defaults to { }.*/
   
    Vehicle.forge({ registration_number : req.params.registration_number })
   .fetch()
   .then(function (vehicle) {
        vehicle.save({
            make: req.body.make, 
            model: req.body.model,
            passenger_seat_number: req.body.passenger_seat_number
        })
        .then(function () {
            res.json({ error: false, message: 'Record updated' });
        });                    
    });
});

router.delete('/:registration_number', function (req, res) {
    
    // pay attention to req.body and req.params
    Vehicle.forge({ registration_number: req.params.registration_number })
    .fetch()
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

