'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    idOrder: DataTypes.STRING,
    idDelivery:DataTypes.STRING,
    idUser: DataTypes.STRING,
    idPayment: DataTypes.STRING,
    nameCustomer: DataTypes.STRING,
    sdtOrder: DataTypes.STRING,
    address: DataTypes.STRING,
    idStatus: DataTypes.STRING,
    total: DataTypes.DOUBLE,
    dayCreateAt: DataTypes.DATE,
    dayUpdateAt: DataTypes.DATE,               
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};