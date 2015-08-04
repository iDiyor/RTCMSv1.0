'use strict';

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var MessageBox = require('./MessageBoxModel.js');

var Message = bookshelf.Model.extend({
    tableName: 'message',
    idAttribute: 'id_message',
    messagebox: function () {
        return this.belongsTo('MessageBox', 'id_messagebox');
    }
});

module.exports = bookshelf.model('Message', Message);