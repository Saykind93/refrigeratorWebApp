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
      models.Product.belongsTo(models.Category,
        {foreignKey: 'category_id'}),
      models.Product.belongsToMany(models.User, { through: models.UserProduct,  foreignKey: 'id', onDelete: 'CASCADE' })

      // define association here
    }
  };
  Product.init({
    Name: DataTypes.STRING,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
