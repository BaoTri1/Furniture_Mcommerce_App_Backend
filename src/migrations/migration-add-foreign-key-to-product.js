'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Products', {
        fields: ['idCategory'],
        type: 'foreign key',
        name: 'fkey_constraint_idCategory_Products',
        references: { //Required field
          table: 'Categorys',
          field: 'idCat'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });

      await queryInterface.addConstraint('Products', {
        fields: ['idTypesRoom'],
        type: 'foreign key',
        name: 'fkey_constraint_idTypesRoom_Products',
        references: { //Required field
          table: 'KindOfRooms',
          field: 'idRoom'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
  },
      
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Products', 'fkey_constraint_idCategory_Products');
    await queryInterface.removeConstraint('Products', 'fkey_constraint_idTypesRoom_Products');
  },
};