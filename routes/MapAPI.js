'use strict';

var express = require('express');
var router = express.Router();

var Location = require('./../models/LocationMapModel.js');

// get all locations stored in the database
router.get('/locations', function (req, res) {
    Location.forge()
    .fetchAll()
    .then(function (location) {
        res.json(location.toJSON());
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

module.exports = router;