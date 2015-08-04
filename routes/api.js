var express = require('express');
var router = express.Router();

var accessControll = require('./AccessAPI')
var drivers = require('./DriverAPI');
var vehicles = require('./VehicleAPI');
var maps = require('./MapAPI');
var messages = require('./MessageAPI');

 //'/' is same as localhost:port/api/ 
 //if you type /api/ it will account as localhost:port/api/api <-- "/api/api"
router.get('/', function (req, res) {
    res.json({ hello: "api route" });
});

router.use('/user', accessControll);
router.use('/drivers', drivers);
router.use('/vehicles', vehicles);
router.use('/maps', maps);
router.use('/messages', messages);

module.exports = router;