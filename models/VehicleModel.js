'use strict';

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');
var DriverProfile = require('./DriverProfileModel.js');

var Vehicle = bookshelf.Model.extend({
    tableName: 'vehicle',
    idAttribute: 'id_registration_number', // this line helped to implement update(HTTP->PUT) of a record
    driver : function () {
        return this.belongsTo('DriverProfile', 'id_driver');
    }
});

module.exports = bookshelf.model('Vehicle', Vehicle);