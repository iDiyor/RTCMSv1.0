'use strict';

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var Message = require('./MessageModel.js');

var MessageBox = bookshelf.Model.extend({
    tableName: 'messagebox',
    idAttribute: 'id_messagebox',
    user: function () {
        return this.belongsTo('UserProfile', 'id_user_profile');
    },
    message: function () {
        /* hasOne ==> messagebox[index].message
         * hasMany ==> messagebox[index].mesage[index].content */
        return this.hasMany('Message', 'id_messagebox');
    }
});

module.exports = bookshelf.model('MessageBox', MessageBox);