
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : 'dbinstance1.cxlrzd9e5nxe.eu-central-1.rds.amazonaws.com',
        user     : 'aws_master_diyor',
        password : 'diyor2amazon',
        database : 'procabdb',
        charset  : 'utf8'
    }
});

module.exports = require('bookshelf')(knex);