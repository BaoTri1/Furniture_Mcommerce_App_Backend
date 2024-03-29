'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Rating.init({
    idRat: DataTypes.STRING,
    idUser: DataTypes.STRING,
    idProduct: DataTypes.STRING,
    point: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    timeCreate: DataTypes.DATE,                
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};