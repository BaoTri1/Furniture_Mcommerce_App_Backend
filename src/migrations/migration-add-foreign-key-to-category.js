'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Categorys', {
        fields: ['catParent'],
        type: 'foreign key',
        name: 'fkey_constraint_catParent_Categorys',
        references: { //Required field
          table: 'parentCategorys',
          field: 'idcatParent'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Categorys', 'fkey_constraint_catParent_Categorys');
  },
};