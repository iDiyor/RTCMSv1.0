'use strict';

var express = require('express');
var async = require('async');
var router = express.Router();

var Job = require('./../models/JobModel.js');
var DriverProfile = require('./../models/DriverProfileModel.js');

router.get('/', function (req, res) {
    Job.forge()
    .fetchAll({ withRelated: ['driver', 'driver.userProfile', 'direction', 'direction.source', 'direction.destination'] })
    .then(function (jobs) {
        res.json(jobs.toJSON());
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

router.get('/:id_job', function (req, res) {
    Job.forge({ id_job: req.params.id_job })
    .fetch({ withRelated: ['driver', 'driver.userProfile','direction', 'direction.source', 'direction.destination'] })
    .then(function (job) {
        res.json(job.toJSON());
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});
// user`s jobs
router.get('/user/:id_user_profile', function (req, res) {
    Job.forge()
    .fetchAll({ withRelated: ['driver', 'driver.userProfile', 'direction', 'direction.source', 'direction.destination'] })
    .then(function (job) {
        res.json(job.toJSON());
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

router.post('/', function (req, res) {
    Job.forge({
        client_name: req.body.client_name,
        description: req.body.description,
        from_address: req.body.from_address,
        from_postcode: req.body.from_postcode,
        to_address: req.body.to_address,
        to_postcode: req.body.to_postcode,
        phone_number: req.body.phone_number,
        time: req.body.time,
        id_driver: req.body.id_driver
    })
    .save(null, { method: 'insert' })
    .then(function (newJob) {
        res.json({
            responseTitle: 'New job has been inserted into DB',
            responseStatus: 'success',
            responseBody: newJob.toJSON()
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

router.put('/:id_job', function (req, res) {
    Job.forge({ id_job: req.params.id_job })
    .fetch({ require: true })
    .then(function (job) {
        job.save({
            client_name: req.body.client_name,
            description: req.body.description,
            from_address: req.body.from_address,
            from_postcode: req.body.from_postcode,
            to_address: req.body.to_address,
            to_postcode: req.body.to_postcode,
            phone_number: req.body.phone_number,
            time: req.body.time,
            id_driver: req.body.id_driver
        })
        .then(function (updatedJob) {
            res.json({
                responseTitle: 'Job has been updated',
                responseStatus: 'success',
                responseBody: updatedJob.toJSON()
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

router.delete('/:id_job', function (req, res) {
    Job.forge({ id_job: req.params.id_job })
    .fetch({ require: true })
    .then(function (job) {
        job.destroy()
        .then(function () {
            res.json({
                responseTitle: 'Job has been deleted',
                responseStatus: 'success',
                responseBody: {}
            })
        })
        .catch(function (error) {
            res.status(500).json({ error: true, data: { message: error.message } });
        })
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    }); 
});

module.exports = router;