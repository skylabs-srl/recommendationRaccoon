'use strict';

module.exports = function(sequelize, DataTypes) {

  var receiptProduct = sequelize.define("ReceiptProduct", {
    quantity: {
      type: DataTypes.BIGINT(11),
      allowNull: true
    },
    receiptId: {
      type: DataTypes.BIGINT(11),
      allowNull: true
    },
    productId: {
      type: DataTypes.BIGINT(11),
      allowNull: true
    },
    price: {
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

  return receiptProduct;
};
/*
CREATE TABLE `ReceiptProduct` (
	`id` Int( 11 ) AUTO_INCREMENT NOT NULL,
	`quantity` Int( 11 ) NULL,
	`price` Decimal( 10, 2 ) NULL,
	`receiptId` Int( 11 ) NULL,
	`productId` Int( 11 ) NULL,
	PRIMARY KEY ( `id` ) )
CHARACTER SET = latin1
COLLATE = latin1_swedish_ci
ENGINE = InnoDB
AUTO_INCREMENT = 16;
*/
