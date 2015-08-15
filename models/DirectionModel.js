'use strict';

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');
var Job = require('./JobModel.js');
var Location = require('././LocationModel.js');

var Direction = bookshelf.Model.extend({
    tableName: 'direction',
    idAttribute: 'id_direction',
    job: function () {
        return this.belongsTo('Job', 'id_job');
    },
    source: function () {
        return this.belongsTo('Location', 'src_id_location');
    },
    destination: function () {
        return this.belongsTo('Location', 'dest_id_location');
    }
});

module.exports = bookshelf.model('Direction', Direction);