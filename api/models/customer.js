'use strict';

module.exports = function(sequelize, DataTypes) {

  var customer = sequelize.define("Customer", {
    note: {
      type: DataTypes.STRING(512),
      allowNull: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    indexes: [{
      unique: true,
      fields: ['id']
    }],
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return customer;
};
