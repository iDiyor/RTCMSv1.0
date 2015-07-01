var express = require('express');
var router = express.Router();

var bookshelf = require('./bookshelfRTCMS.js');

var Vehicle = bookshelf.Model.extend({
    tableName: 'vehicle'
});

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

module.exports = router;

