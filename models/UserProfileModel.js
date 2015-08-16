'use strict'

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var User = require('./UserModel.js');
var DriverProfile = require('./DriverProfileModel.js');

var UserProfile = bookshelf.Model.extend( {
    tableName: 'user_profile',
    idAttribute: 'id_user_profile',
    userRole: function () {
        return this.belongsTo('UserRole', 'id_role');
    },
    driverProfile: function () {
        return this.hasOne('DriverProfile', 'id_user_profile');
    }

});

module.exports = bookshelf.model('UserProfile', UserProfile);
