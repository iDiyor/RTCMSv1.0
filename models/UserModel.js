'use strict'

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var UserProfile = require('./UserProfileModel.js');

var User = bookshelf.Model.extend( {
    tableName: 'user',
    idAttribute: 'id_user',
    userRole: function () {
        return this.hasOne('UserRole', 'id_user');
    }

});

var UserRole = bookshelf.Model.extend({
    tableName: 'user_role',
    idAttribute: 'id_role',
    user: function () {
        return this.belongsTo('User', 'id_user');  
    },
    userProfile: function () { // !IMPORTANT! - name of function should be same as load attribute -> load(['function_name']);
        return this.hasOne('UserProfile', 'id_role');
    }
});

var UserStatus = bookshelf.Model.extend({
    tableName: 'status',
    idAttribute: 'id_status'

});

module.exports = bookshelf.model('User', User);
module.exports = bookshelf.model('UserRole', UserRole);
module.exports = bookshelf.model('UserStatus', UserStatus);

module.exports = {
    User: User, 
    UserRole: UserRole, 
    UserStatus: UserStatus
};
