'use strict'

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

// document
// vehicle
var Vehicle = require('././VehicleModel.js');
var Document = require('./DocumentModel.js');

var UserProfile = bookshelf.Model.extend({
    tableName: 'user_profile',
    idAttribute: 'id_user_profile',
    vehicle: function () {
        /* hasOne ==> driver[index].vehicle.make
         * hasMany ==> driver[index].vehicle[index].make */
        return this.hasOne('Vehicle', 'id_driver');
    },
    document: function () {
        return this.hasOne('Document', 'id_user_profile');
    }
});

module.exports = bookshelf.model('UserProfile', UserProfile);
