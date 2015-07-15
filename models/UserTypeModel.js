'use strict'

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var DriverTypeGroup = bookshelf.Model.extend({
    tableName: 'driverTypeGroup',
    idAttribute: 'id_driver_group'

});

var AdminTypeGroup = bookshelf.Model.extend({
    tableName: 'adminTypeGroup',
    idAttribute: 'id_admin_group'
});


var UserType = bookshelf.Model.extend({
    tableName: 'userType',
    idAttribute: 'id_user_type',

});



module.exports = bookshelf.model('UserType', UserType);