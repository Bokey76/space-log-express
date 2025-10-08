module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "friend_link",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: "id",
      },
      friendName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "朋友名称",
      },
      coverLink: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "友链封面url",
      },
      url: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "友链url连接",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "朋友描述",
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "pending", "rejected"),
        allowNull: false,
        defaultValue: "pending",
        comment: "友链状态",
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "创建时间",
      },
      updatedTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "更新时间",
      },
    },
    {
      sequelize,
      tableName: "friend_link",
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
      hooks: {
        // 创建前，设置状态为待审核
        beforeCreate: async (friendLink) => {
          friendLink.status = "pending"; // 默认状态为：通过
        },
        // 删除前，删除所有封面
        beforeBulkDestroy: async (friendLink) => {
          const ossService = require("../services/ossService"); // 避免循环依赖
          let friendLinksArr = [];
          if (typeof friendLink.where.id == "string") {
            friendLinksArr = [friendLink.where.id];
          } else {
            for (const id of friendLink.where.id[
              Object.getOwnPropertySymbols(friendLink.where.id)[0]
            ]) {
              friendLinksArr.push(id);
            }
          }
          try {
            for (const id of friendLinksArr) {
              await ossService.deleteFile(`/image/friendLinkCover/${id}.png`);
            }
          } catch (error) {
            throw new Error(`删除友链时出错: ${error.message}`);
          }
        },
      },
    }
  );
};
