'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {   
    await queryInterface.createTable('PaymentMethods', {  
      idPayment: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      namePayment: {
        allowNull: false,
        type: Sequelize.STRING
      },
      iconPayment: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PaymentMethods');
  }
};