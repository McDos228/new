const fs = require('fs');

module.exports = {
        development:{
                username: 'postgres',
                password: '',
                database: 'dev_test',
                host: 'localhost',
                dialect: 'postgres'
        },
        test: {
                username: 'postgres',
                password: 111100,
                database: 'test_task',
                host: '127.0.0.1',
                dialect: 'postgres'
        },
        production: {
                username: 'root',
                password: null,
                database: 'database_test',
                host: '127.0.0.1',
                dialect: 'postgres'
        }
};

module.exports.secret = 'secret';