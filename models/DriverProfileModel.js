'use strict';

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var UserProfile = require('./UserProfileModel.js');
var Document = require('./DocumentModel.js');
var Vehicle = require('./VehicleModel.js');

var Driver = bookshelf.Model.extend({
    tableName: 'driver_profile',
    idAttribute: 'id_driver',
    userProfile: function () {
        return this.hasOne('UserProfile', 'id_user_profile');
    },
    document: function () {
        return this.hasOne('Document', 'id_document');
    },
    vehicle: function () {
        /* hasOne ==> driver[index].vehicle.make
         * hasMany ==> driver[index].vehicle[index].make */
        return this.hasOne('Vehicle', 'id_registration_number');
    }

});

module.exports = bookshelf.model('Driver', Driver);