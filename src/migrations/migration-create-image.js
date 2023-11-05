'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {  
      idProduct: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nameImage: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      typeImg: {
        allowNull: false,
        type: Sequelize.STRING
      },
      imgUrl: {
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
    await queryInterface.dropTable('Images');
  }
};