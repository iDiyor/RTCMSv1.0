var express = require('express');
var router = express.Router();

var bookshelf = require('./bookshelfRTCMS.js');

var Driver, Vehicle;

Driver = bookshelf.Model.extend({
    tableName: 'driver',
    vehicle : function () {
        return this.hasOne(Vehicle);
    }
});

Vehicle = bookshelf.Model.extend({
    tableName: 'vehicle',
    driver: function () {
        return this.belongsTo(Driver);
    }
});

// get all drivers list
router.get('/', function (req, res) {
    Driver.forge()
    .fetchAll()
    .then(function (driversCollection) {
        res.json(driversCollection.toJSON());
    }).catch(function (error) {
        console.log(error);
        res.send('An error occured');
    });
});

// get a driver by id
router.get('/:id_driver', function (req, res) {
    /* req.params - An object containing properties mapped to the named route “ parameters”.For example, 
    if youhavethe route /user/:name, thenthe“name” property is available as req.params.name.
    This object defaults to { }.*/
    Driver.forge({ id_driver: req.params.id_driver })      
   .fetch()
   .then(function (driverData) {
        res.json(driverData.toJSON());
    });
});

// create a new driver and insert into the database
router.post('/', function (req, res) {
    Driver.forge({
        first_name: 'firstName',
        middle_name: 'middleName',
        last_name: 'lastName',
        date_of_birth: '2015-06-18',
        post_code: 'postCode',
        house_number: '6',
        address_line_1: 'addressLine1',
        address_line_2: 'addressLine2',
        phone_number: '12345678',
        email: 'email@gmail.com',
        driving_licence_number: 'DLN7777',
        vehicle_id_fk: '2'
    })
    .save()
    .then(function (driver) {
        res.json({ error: false, data: { id: driver.get('id_driver') } });
    });
    
});

// delete a driver from database
router.delete('/:id_driver', function (req, res) {
    Driver.forge({ id_driver: req.params.id_driver })
   .fetch({ require: true })
   .then(function (driverData) {
        driverData.destroy();
        res.json({ message: 'Driver successfully deleted' });
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