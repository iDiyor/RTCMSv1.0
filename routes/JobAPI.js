'use strict';

var express = require('express');
var async = require('async');
var router = express.Router();

var Job = require('./../models/JobModel.js');

router.get('/', function (req, res) {
    Job.forge()
    .fetchAll()
    .then(function (jobs) {
        res.json(jobs.toJSON());
    })
    .catch(function (error) {
        es.status(500).json({ error: true, data: { message: error.message } });
    });
});

module.exports = router;