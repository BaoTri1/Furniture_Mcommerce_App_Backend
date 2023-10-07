'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      fullName: 'Admin',
      sdtUser: '0941023775',
      email: 'admin@gmail.com',
      gender: true,
      dateOfBirth: new Date(2001, 2, 28),
      avatar: 'https://cdn.oneesports.vn/cdn-data/sites/4/2022/11/t1-faker-thumb.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
     
  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
