'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Images', {
        fields: ['idProduct'],
        type: 'foreign key',
        name: 'fkey_constraint_idProduct_Images',
        references: { //Required field
          table: 'Products',
          field: 'idProduct'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Images', 'fkey_constraint_idProduct_Images');
  },
};