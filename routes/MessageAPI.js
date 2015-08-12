'use strict';

var express = require('express');
var async = require('async');
var router = express.Router();

var Message = require('./../models/MessageModel.js');

// withRelated: [message] == model.load(['message])

// all messages in the database
router.get('/', function (req, res) {
    Message.forge()
    .fetchAll()
    .then(function (messages) {
        res.json(messages.toJSON());
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});
// all messages to UserA
router.get('/:to_id_user_profile', function (req, res) {
    Message.forge({ to_id_user_profile: req.params.to_id_user_profile })
    .fetchAll({ require: true })
    .then(function (messages) {
        messages
        .query('where', 'to_id_user_profile', '=', req.params.to_id_user_profile)
        .fetch(/*{ debug: true }*/)
        .then(function (sortedMessages) {
            res.json(sortedMessages.toJSON());
        });
        //res.json(messages.toJSON());
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });
});

// all messages to UserA from UserB
router.get('/:to_id_user_profile/:from_id_user_profile', function (req, res) {
    Message.forge({
        //to_id_user_profile: req.params.to_id_user_profile,
        //from_id_user_profile: req.params.from_id_user_profile,
    })
    .fetchAll({
        //debug: true,
        require: true,
        withRelated: [{
                'fromUser' : function (qb) {
                    qb.column('id_user_profile', 'first_name', 'last_name'); // used in chat view 
                },
                'toUser' : function (qb) {
                    qb.column('id_user_profile', 'first_name', 'last_name');
                }
            }]
     })
    .then(function (messages) {
        
        async.series([
            // admin - client
            function (callback) {
                messages
                .query('where', 'to_id_user_profile', '=', req.params.to_id_user_profile)
                .query('where', 'from_id_user_profile', '=', req.params.from_id_user_profile)
                .fetch(/*{ debug: true }*/)
                .then(function (sortedMessages) {
                    //res.json(sortedMessages.toJSON());
                    callback(null, sortedMessages.toJSON());
                })
                .catch(function (error) {
                    callback(error);
                });
            },
            // client - admin
            function (callback) {
                messages
                .query('where', 'to_id_user_profile', '=', req.params.from_id_user_profile)
                .query('where', 'from_id_user_profile', '=', req.params.to_id_user_profile)
                .fetch(/*{ debug: true }*/)
                .then(function (sortedMessages) {
                    //res.json(sortedMessages.toJSON());
                    callback(null, sortedMessages.toJSON());
                })
                .catch(function (error) {
                    callback(error);
                });
            }
        ],
            function (error, result) {
            if (error) res.status(500).json({ error: true, data: { message: error.message } });
            
            var combinedArray = result[0].concat(result[1]);
            res.json(combinedArray);
        });
            

        //messages
        //.query('where', 'to_id_user_profile', '=', req.params.to_id_user_profile)
        //.query('where', 'from_id_user_profile', '=', req.params.from_id_user_profile)
        //.fetch(/*{ debug: true }*/)
        //.then(function (sortedMessages) {
        //    //res.json(sortedMessages.toJSON());
        //    allMessages.concat(sortedMessages);
        //});
        
    })
    .catch(function (error) {
        res.status(500).json({ error: true, data: { message: error.message } });
    });    
});

// new message to UserA
router.post('/', function (req, res) {
    Message.forge({
        to_id_user_profile: req.body.to_id_user_profile,
        from_id_user_profile: req.body.from_id_user_profile,
        content: req.body.content
    })
    .save(null, { method: 'insert' })
    .then(function (message) {
        
        message.load([{
                'fromUser' : function (qb) {
                    qb.column('id_user_profile', 'first_name', 'last_name'); // used in chat view 
                },
                'toUser' : function (qb) {
                    qb.column('id_user_profile', 'first_name', 'last_name');
                }
            }])
        .then(function (messageWithExtraData) {
            res.json({
                responseTitle: 'Inserting a new message into the database',
                responseStatus: 'success',
                responseBody: message.toJSON()
            });
        });       
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