'use strict'

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var UserProfile = require('./UserProfileModel.js');

var AdminProfile = bookshelf.Model.extend({
    tableName: 'admin_profile',
    idAttribute: 'id_admin',
    userProfile: function () {
        return this.belongsTo('UserProfile', 'id_user_profile');
    }
});

module.exports = bookshelf.model('AdminProfile', AdminProfile);