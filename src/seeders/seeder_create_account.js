'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Accounts', [{
      idUser: 1,
      sdt: '0941023775',
      password: '123456',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
     
  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Accounts', null, {});
  }
};
