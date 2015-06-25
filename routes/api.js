var express = require('express');
var router = express.Router();

var staff = require('./staff');

 //'/' is same as localhost:port/api/ 
 //if you type /api/ it will account as localhost:port/api/api <-- "/api/api"
router.get('/', function (req, res) {
    res.json({ hello: "api route" });
});

router.use('/staff', staff);

module.exports = router;