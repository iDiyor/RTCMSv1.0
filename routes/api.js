var express = require('express');
var router = express.Router();

var drivers = require('./DriverAPI');
var vehicles = require('./VehicleAPI');
var maps = require('./MapAPI');

 //'/' is same as localhost:port/api/ 
 //if you type /api/ it will account as localhost:port/api/api <-- "/api/api"
router.get('/', function (req, res) {
    res.json({ hello: "api route" });
});

router.use('/drivers', drivers);
router.use('/vehicles', vehicles);
router.use('/maps/', maps);

module.exports = router;