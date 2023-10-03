'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {  
      idProduct: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      idCategory: {
        allowNull: false,
        type: Sequelize.STRING
      },
      idTypesRoom: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nameProduct: {
        allowNull: false,
        type: Sequelize.STRING
      },
      price: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      material: {
        allowNull: false,
        type: Sequelize.STRING
      },
      size: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Products');
  }
};