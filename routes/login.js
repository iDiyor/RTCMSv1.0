var express = require('express');
var router = express.Router();

var database = require('./db.js');


router.post('/', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    //res.send(username);

    database.getConnection(function (err, connection) {
    if (err) {
        console.error('Connection error: ', err);
        res.statusCode = 503;
        res.send({ result: 'error', err: err.code });
    } else {
        connection.query('SELECT username, password from test', function (err, rows, fields) {
                if (!err) {
                    res.send(rows.length.toString());
            } else {
                console.log('Error while performing Query.');
            }
        });
        connection.release();
    }
});
});

module.exports = router;