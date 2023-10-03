'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Discount.init({
    idDiscount: DataTypes.STRING,
    idProduct: DataTypes.STRING,
    nameDiscount: DataTypes.STRING,
    value: DataTypes.INTEGER,
    numDiscount: DataTypes.INTEGER,
    dayStart: DataTypes.DATE,
    dayEnd: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Discount',
  });
  return Discount;
};