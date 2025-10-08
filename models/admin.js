module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "admin",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: "管理员id",
      },
      mail: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "管理员邮箱",
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "admin",
      timestamps: true,
      createdAt: "createTime",
      updatedAt: "updatedTime",
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
