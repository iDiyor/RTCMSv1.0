'use strict';

var express = require('express');
var router = express.Router();

var Location = require('./../models/LocationModel.js');
var Direction = require('./../models/DirectionModel.js');

/***************
 * LOCATION
 **************/
// get all locations stored in the database
router.get('/locations', function (req, res) {
    Location.forge()
    .fetchAll()
    .then(function (locations) {
        res.json(locations.toJSON());
    })
    .catch(function (error) {
        res.status(500).json({ error: true, message: error.message });
    });
});

router.post('/locations', function (req, res) {
    Location.forge({
        description: req.body.description,
        longitude: req.body.longitude,
        latitude: req.body.latitude
    })
    .save(null, { method: 'insert' })
    .then(function (newLocation) {
        res.json({
            responseTitle: 'New locations has been inserted into DB',
            responseStatus: 'success',
            responseBody: newLocation.toJSON()
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

router.put('locations/:id_location', function (req, res) {
    Location.forge({ id_location: req.params.id_location })
    .fetch({ require: true })
    .then(function (location) {
        location.save({
            description: req.body.description,
            longitude: req.body.longitude,
            latitude: req.body.latitude
        })
        .then(function (updatedLocation) {
            res.json({
                responseTitle: 'Location has been updated',
                responseStatus: 'success',
                responseBody: updatedLocation.toJSON()
            })
        })
        .catch(function (error) {
            res.status(500).json({ error: true, data: { message: error.message } });
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});
router.delete('locations/:id_location', function (req, res) {
    Location.forge({ id_location: req.params.id_location })
    .fetch({ require: true })
    .then(function (location) {
        location.destroy()
        .then(function () {
            res.json({
                responseTitle: 'Location has been deleted',
                responseStatus: 'success',
                responseBody: {}
            })
        })
        .catch(function (error) {
            res.status(500).json({ error: true, data: { message: error.message } });
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

/***************
 * DIRECTION
 **************/
// get all locations stored in the database
router.get('/directions', function (req, res) {
    Direction.forge()
    .fetchAll()
    .then(function (directions) {
        res.json(directions.toJSON());
    })
    .catch(function (error) {
        res.status(500).json({ error: true, message: error.message });
    });
});

router.post('/directions', function (req, res) {
    Direction.forge({
        id_job: req.body.id_job,
        src_id_location: req.body.src_id_location,
        dest_id_location: req.body.dest_id_location
    })
    .save(null, { method: 'insert' })
    .then(function (newDirection) {
        res.json({
            responseTitle: 'New direction has been inserted into DB',
            responseStatus: 'success',
            responseBody: newDirection.toJSON()
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

router.put('directions/:id_direction', function (req, res) {
    Direction.forge({ id_direction: req.params.id_direction })
    .fetch({ require: true })
    .then(function (direction) {
        direction.save({
            id_job: req.body.id_job,
            scr_id_location: req.body.src_id_location,
            dest_id_location: req.body.dest_id_location
        })
        .then(function (updatedDirection) {
            res.json({
                responseTitle: 'Direction has been updated',
                responseStatus: 'success',
                responseBody: updatedDirection.toJSON()
            })
        })
        .catch(function (error) {
            res.status(500).json({ error: true, data: { message: error.message } });
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});
router.delete('directions/:id_direction', function (req, res) {
    Direction.forge({ id_direction: req.params.id_direction })
    .fetch({ require: true })
    .then(function (direction) {
        direction.destroy()
        .then(function () {
            res.json({
                responseTitle: 'Direction has been deleted',
                responseStatus: 'success',
                responseBody: {}
            })
        })
        .catch(function (error) {
            res.status(500).json({ error: true, data: { message: error.message } });
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});
module.exports = router;