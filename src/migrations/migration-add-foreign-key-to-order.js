'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Orders', {
        fields: ['idUser'],
        type: 'foreign key',
        name: 'fkey_constraint_idUser_Orders',
        references: { //Required field
          table: 'Users',
          field: 'idUser'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });

      await queryInterface.addConstraint('Orders', {
        fields: ['idDelivery'],
        type: 'foreign key',
        name: 'fkey_constraint_idDelivery_Orders',
        references: { //Required field
          table: 'DeliveryMethods',
          field: 'idShipment'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });

      await queryInterface.addConstraint('Orders', {
        fields: ['idPayment'],
        type: 'foreign key',
        name: 'fkey_constraint_idPayment_Orders',
        references: { //Required field
          table: 'PaymentMethods',
          field: 'idPayment'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });

      await queryInterface.addConstraint('Orders', {
        fields: ['status'],
        type: 'foreign key',
        name: 'fkey_constraint_status_Orders',
        references: { //Required field
          table: 'Status',
          field: 'idStatus'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
  },
      
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Orders', 'fkey_constraint_idUser_Orders');
    await queryInterface.removeConstraint('Orders', 'fkey_constraint_idDelivery_Orders');
    await queryInterface.removeConstraint('Orders', 'fkey_constraint_idPayment_Orders');
    await queryInterface.removeConstraint('Orders', 'fkey_constraint_status_Orders');
  },
};