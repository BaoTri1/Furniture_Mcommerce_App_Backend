'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init({
    idProduct: DataTypes.STRING,
    idCategory: DataTypes.STRING,
    idTypesRoom: DataTypes.STRING,
    nameProduct: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    quantity: DataTypes.INTEGER,
    material: DataTypes.STRING,
    size: DataTypes.STRING,
    description: DataTypes.TEXT               
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};