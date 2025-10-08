module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "user",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        comment: "用户id",
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "用户名",
      },
      mail: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "用户邮箱",
        unique: "mail",
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "用户注册时间",
      },
      updatedTime: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "用户信息更新时间",
      },
    },
    {
      sequelize,
      tableName: "user",
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
        {
          name: "mail",
          unique: true,
          using: "BTREE",
          fields: [{ name: "mail" }],
        },
      ],
    }
  );
};
