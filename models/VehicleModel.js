'use strict';

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');
var Driver = require('./DriverModel.js');

var Vehicle = bookshelf.Model.extend({
    tableName: 'vehicle',
    idAttribute: 'id_registration_number', // this line helped to implement update(HTTP->PUT) of a record
    driver : function () {
        return this.belongsTo('Driver', 'id_driver');
    }
});

module.exports = bookshelf.model('Vehicle', Vehicle);