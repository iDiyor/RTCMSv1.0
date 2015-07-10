'use strict';

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var Location = bookshelf.Model.extend({
    tableName: 'location',
    idAttribute: 'id_location'
});

module.exports = bookshelf.model('Location', Location);