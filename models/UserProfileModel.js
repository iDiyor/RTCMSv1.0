'use strict'

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var UserProfile = bookshelf.Model.extend({
    tableName: 'user_profile',
    idAttribute: 'id_user_profile',
});

module.exports = bookshelf.model('UserProfile', UserProfile);
