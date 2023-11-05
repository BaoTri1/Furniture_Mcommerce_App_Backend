'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Discounts', {
        fields: ['idProduct'],
        type: 'foreign key',
        name: 'fkey_constraint_idProduct_Discounts',
        references: { //Required field
          table: 'Products',
          field: 'idProduct'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Discounts', 'fkey_constraint_idProduct_Discounts');
  },
};