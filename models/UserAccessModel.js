'use strict'

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var User = bookshelf.Model.extend( {
    tableName: 'user',
    idAttribute: 'id_user',

});

var UserRole = bookshelf.Model.extend({
    tableName: 'user_role',
    idAttribute: 'id_user'
});

var UserStatus = bookshelf.Model.extend({
    tableName: 'status',
    idAttribute: 'id_status'

});

module.exports = {
    User: User,
    UserRole: UserRole,
    UserStatus: UserStatus
};