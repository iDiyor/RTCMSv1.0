var express = require('express');
var router = express.Router();

var staff = require('./staff');

// '/' is same as localhost:port/api/ 
// if you type /api/ it will account as localhost:port/api/api <-- "/api/api"
//router.get('/', function (req, res) {
//    res.json({ hello: "api route" });
//});

router.use('/staff', staff);



var Sequelize = require('sequelize');

var sequelize = new Sequelize('procabdb', 'aws_master_diyor', 'diyor2amazon', {
    host: 'dbinstance1.cxlrzd9e5nxe.eu-central-1.rds.amazonaws.com',
    port: '3306', 
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 1000

    }

});

router.get('/', function (req, res) {
    sequelize
    .authenticate()
    .complete(function (err) {
        if (!!err) {
            console.log('Unable to connect to the database:', err)
        } else {
            console.log('Connection has been established successfully.')
        }
    })
});

module.exports = router;