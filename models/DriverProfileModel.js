'use strict';

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var UserProfile = require('./UserProfileModel.js');
var Document = require('./DocumentModel.js');
var Vehicle = require('./VehicleModel.js');
var Job = require('./JobModel.js');

var DriverProfile = bookshelf.Model.extend({
    tableName: 'driver_profile',
    idAttribute: 'id_driver',
    userProfile: function () {
        return this.belongsTo('UserProfile', 'id_user_profile');
    },
    document: function () {
        return this.hasOne('Document', 'id_driver');
    },
    vehicle: function () {
        return this.hasOne('Vehicle', 'id_driver');
    },
    job: function () {
        return this.hasMany('Job', 'id_driver');
    }
});

module.exports = bookshelf.model('DriverProfile', DriverProfile);