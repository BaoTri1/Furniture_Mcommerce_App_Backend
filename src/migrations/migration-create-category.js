'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categorys', {  
      idCat: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      nameCat: {
        allowNull: false,
        type: Sequelize.STRING
      },
      catParent: {
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
    await queryInterface.dropTable('Categorys');
  }
};