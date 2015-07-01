var express = require('express');
var router = express.Router();

var drivers = require('./drivers');
var vehicles = require('./vehicles');

 //'/' is same as localhost:port/api/ 
 //if you type /api/ it will account as localhost:port/api/api <-- "/api/api"
router.get('/', function (req, res) {
    res.json({ hello: "api route" });
});

router.use('/drivers', drivers);
router.use('/vehicles', vehicles);

module.exports = router;