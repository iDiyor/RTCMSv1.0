var express = require('express');
var router = express.Router();

var models = require('../models');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : 'dbinstance1.cxlrzd9e5nxe.eu-central-1.rds.amazonaws.com',
        user     : 'aws_master_diyor',
        password : 'diyor2amazon',
        database : 'procabdb',
        charset  : 'utf8'
    }
});

var bookshelf = require('bookshelf')(knex);

var Staff = bookshelf.Model.extend({
    tableName: 'staff'
});

router.get('/', function (req, res) {
    new Staff().fetchAll()
    .then(function (staff_data) {
        res.send(staff_data.toJSON());
    }).catch(function (error) {
        console.log(error);
        res.send('An error occured');
    });
});
//router.get('/', function (req, res) {
    //var username = req.body.username;
    //var password = req.body.password;
    //res.send(username);

    //dbConnection.getConnection(function (err, connection) {
    //    if (err) {
    //        console.error('Connection error: ', err);
    //        res.statusCode = 503;
    //        res.send({ result: 'error', err: err.code });
    //    } else {
    //        connection.query('SELECT * from staff', function (err, rows, fields) {
    //            if (!err) {
    //                res.json(rows);
    //            } else {
    //                console.log('Error while performing Query.');
    //            }
    //        });
    //        connection.release();
    //    }
    //});
//});

module.exports = router;