'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: DataTypes.STRING,
    idAcc: DataTypes.STRING,
    fullName: DataTypes.STRING,
    sdtUser: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    dateOfBirth: DataTypes.DATE,
    avatar: DataTypes.STRING                 
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};