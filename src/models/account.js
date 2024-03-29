'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.hasOne(models.User, {foreignKey: 'idAcc'});
    }
  }
  Account.init({
    idAcc: DataTypes.STRING,
    sdt: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN               
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};