'use strict';

module.exports = function(sequelize, DataTypes) {

  var receipt = sequelize.define("Receipt", {
    customerId: {
      type: DataTypes.BIGINT(11),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
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

  return receipt;
};
/*
CREATE TABLE `Receipt` (
	`id` Int( 11 ) AUTO_INCREMENT NOT NULL,
	`date` DateTime NULL,
	`customerId` Int( 11 ) NULL,
	`total` Decimal( 10, 2 ) NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = latin1
COLLATE = latin1_swedish_ci
ENGINE = InnoDB
AUTO_INCREMENT = 10;
*/
