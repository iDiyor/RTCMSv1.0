'use strict'

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

// document
// vehicle
var Vehicle = require('././VehicleModel.js');
var Document = require('./DocumentModel.js');
var UserAccess = require('./UserAccessModel.js');

var UserRole = UserAccess.UserRole;

var UserProfile = bookshelf.Model.extend({
    tableName: 'user_profile',
    idAttribute: 'id_user_profile',
});

module.exports = bookshelf.model('UserProfile', UserProfile);
