'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Users', {
        fields: ['idAcc'],
        type: 'foreign key',
        name: 'fkey_constraint_idAcc_Users',
        references: { //Required field
          table: 'Accounts',
          field: 'idAcc'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Users', 'fkey_constraint_idAcc_Users');
  },
};