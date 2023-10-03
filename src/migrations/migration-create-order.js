'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {  
      idOrder: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      idDelivery: {
        allowNull: false,
        type: Sequelize.STRING
      },
      idUser: {
        allowNull: false,
        type: Sequelize.STRING
      },
      idPayment: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nameCustomer: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sdtOrder: {
        allowNull: false,
        type: Sequelize.STRING
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      total: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      dayCreateAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      dayUpdateAt: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Orders');
  }
};