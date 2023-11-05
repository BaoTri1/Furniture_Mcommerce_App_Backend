'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('DetailOrder', {
        fields: ['idOrder'],
        type: 'foreign key',
        name: 'fkey_constraint_idOrder_DetailOrder',
        references: { //Required field
          table: 'Orders',
          field: 'idOrder'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });

      await queryInterface.addConstraint('DetailOrder', {
        fields: ['idProduct'],
        type: 'foreign key',
        name: 'fkey_constraint_idProduct_DetailOrder',
        references: { //Required field
          table: 'Products',
          field: 'idProduct'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
  },
      
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('DetailOrder', 'fkey_constraint_idOrder_DetailOrder');
    await queryInterface.removeConstraint('DetailOrder', 'fkey_constraint_idProduct_DetailOrder');
  },
};