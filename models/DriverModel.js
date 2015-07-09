'use strict';

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');
var Vehicle = require('./VehicleModel.js');

//module.exports = bookshelf.Model.extend({
//    tableName: 'driver',
//    idAttribute: 'id_driver',
//    vehicle : function () {
//        return this.hasOne(Vehicle, ['id_driver']);
//    }
//});

var Driver = bookshelf.Model.extend({
    tableName: 'driver',
    idAttribute: 'id_driver',
    vehicle : function () {
        return this.hasOne('Vehicle', 'id_driver');
    }
});

module.exports = bookshelf.model('Driver', Driver);