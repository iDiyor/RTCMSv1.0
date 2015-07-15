'use strict'

var bookshelf = require('./BookshelfConnector.js');
bookshelf.plugin('registry');

var UserLogin = bookshelf.Model.extend( {
    tableName: 'userLogin',
    idAttribute: 'id_user',

});

var UserType = bookshelf.Model.extend({
    tableName: 'userType',
    idAttribute: 'id_user_type'
});

var DriverTypeGroup = bookshelf.Model.extend({
    tableName: 'driverTypeGroup',
    idAttribute: 'id_driver_group'

});

var AdminTypeGroup = bookshelf.Model.extend({
    tableName: 'adminTypeGroup',
    idAttribute: 'id_admin_group'
});

var ConnectionStatus = bookshelf.Model.extend({
    tableName: 'status',
    idAttribute: 'id_status'

});

module.exports = {
    UserLogin: UserLogin,
    UserType: UserType,
    DriverTypeGroup: DriverTypeGroup,
    AdminTypeGroup: AdminTypeGroup,
    ConnectionStatus: ConnectionStatus
};