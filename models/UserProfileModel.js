'use strict'

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var User = require('./UserModel.js');

var UserProfile = bookshelf.Model.extend( {
    tableName: 'user_profile',
    idAttribute: 'id_user_profile',
    userRole: function () {
        return this.belongsTo('UserRole', 'id_role');
    }
});

module.exports = bookshelf.model('UserProfile', UserProfile);
