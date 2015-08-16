'use strict';

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var DriverProfile = require('./DriverProfileModel.js');
var Direction = require('./DirectionModel.js');

var Job = bookshelf.Model.extend({
    tableName: 'job',
    idAttribute: 'id_job',
    driver: function () {
        return this.belongsTo('DriverProfile', 'id_driver');
    },
    direction: function () {
        return this.hasMany('Direction', 'id_job');
    }
});

module.exports = bookshelf.model('Job', Job);