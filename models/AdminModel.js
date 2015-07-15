'use strict'

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var Admin = bookshelf.Model.extend({
    tableName: 'admin',
    idAttribute: 'id_admin'

});

module.exports = bookshelf.model('Admin', Admin);