'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', [{
        username: 'new user',
        password: 'test',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'test user',
        password: 'test',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
  }
};
