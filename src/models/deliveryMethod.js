'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeliveryMethod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DeliveryMethod.init({
    idShipment: DataTypes.STRING,
    nameShipment: DataTypes.STRING,
    fee: DataTypes.DOUBLE,
    timeShip: DataTypes.STRING,
    iconShipment: DataTypes.STRING,               
  }, {
    sequelize,
    modelName: 'DeliveryMethod',
  });
  return DeliveryMethod;
};