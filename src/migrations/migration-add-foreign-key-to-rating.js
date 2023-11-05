'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Ratings', {
        fields: ['idUser'],
        type: 'foreign key',
        name: 'fkey_constraint_idUser_Rating',
        references: { //Required field
          table: 'Users',
          field: 'idUser'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });

      await queryInterface.addConstraint('Ratings', {
        fields: ['idProduct'],
        type: 'foreign key',
        name: 'fkey_constraint_idProduct_Rating',
        references: { //Required field
          table: 'Products',
          field: 'idProduct'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
  },
      
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Ratings', 'fkey_constraint_idUser_Rating');
    await queryInterface.removeConstraint('Ratings', 'fkey_constraint_idProduct_Rating');
  },
};