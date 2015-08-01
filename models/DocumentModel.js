'use strict'

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var Document = bookshelf.Model.extend({
    tableName: 'document',
    idAttribute: 'id_document',
    user: function () {
        return this.belongsTo('UserProfile', 'id_user_profile'); 
    }

});

module.exports = bookshelf.model('Document', Document);