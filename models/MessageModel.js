'use strict';

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var UserProfile = require('./UserProfileModel.js');

var Message = bookshelf.Model.extend({
    tableName: 'message',
    idAttribute: 'id_message',
    hasTimestamps: ['time'],
    fromUser : function () {
        return this.belongsTo('UserProfile', 'from_id_user_profile');
    },
    toUser : function () {
        return this.belongsTo('UserProfile', 'to_id_user_profile');
    }
});

module.exports = bookshelf.model('Message', Message);