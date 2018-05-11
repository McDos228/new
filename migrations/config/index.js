let env = process.env.NODE_ENV || 'development';
const config = require('../../api/app/config/config')[env];

module.exports = {
    [env]: {
        database: config.database,
        username: config.username,
        password: config.password,
        dialect: config.dialect
    }
};