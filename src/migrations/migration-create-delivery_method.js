'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {   
    await queryInterface.createTable('DeliveryMethods', {  
      idShipment: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      nameShipment: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fee: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      timeShip: {
        allowNull: false,
        type: Sequelize.STRING
      },
      iconShipment: {
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
    await queryInterface.dropTable('DeliveryMethods');
  }
};