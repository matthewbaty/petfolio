const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class File extends Model { };

File.init(
  {
    file_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'pet',
            key: 'pet_id'
        },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'file',
  }
);

module.exports = File;