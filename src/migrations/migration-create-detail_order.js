'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {   
    await queryInterface.createTable('DetailOrder', { 
      idOrder: {
        allowNull: false,
        type: Sequelize.STRING
      },
      idProduct: {
        allowNull: false,
        type: Sequelize.STRING
      },
      numProduct: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('DetailOrder');
  }
};