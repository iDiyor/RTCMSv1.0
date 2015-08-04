'use strict';

var express = require('express');
var router = express.Router();

var MesssageBox = require('./../models/MessageBoxModel.js');

router.get('/', function (req, res) {
    MesssageBox.forge()
    .fetchAll()
    .then(function (messageboxes) {
        messageboxes
        .load(['message'])
        .then(function (collection) {
            res.json(collection.toJSON());
        })
        .catch(function (error) {
            console.error(error);
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

// all mesageboxes
router.get('/messagebox', function (req, res) {
    MesssageBox.forge()
    .fetchAll()
    .then(function (messagebox) {
        res.json(messagebox.toJSON());
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
    
});
// a messagebox by id
router.get('/messagebox/:id_messagebox', function (req, res) {
    
    MesssageBox.forge({ id_messagebox: req.params.id_messagebox })
    .fetch({ require: true })
    .then(function (messagebox) {
        messagebox.load(['message'])
        .then(function (model) {
            res.json(model.toJSON());
        })
        .catch(function (error) {
            console.error(error);
        });
        
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

router.get('/user/:id_user_profile', function (req, res) {
    MesssageBox.forge({ id_user_profile: req.params.id_user_profile })
    .fetch({ withRelated: ['message']}) // withRelated: [message] == model.load(['message])
    .then(function (messagebox) {
        res.json(messagebox.toJSON());
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

router.post('/user', function (req, res) {
    MesssageBox.forge({ id_user_profile: req.body.to_id_user_profile })
    .fetch({ withRelated: ['message'] })// withRelated: [message] == model.load(['message])
    .then(function (messagebox) {
        
        var message = messagebox.related('message');
        message
        .query('where', 'from_id_user_profile', '=', req.body.from_id_user_profile)
        .fetch({ debug: true })
        .then(function (model) {
            res.json(model);
        });
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

module.exports = router;