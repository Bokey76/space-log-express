module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "article_type",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: "文章类型",
      },
      theme: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "类型主题",
      },
      introduction: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "类型简介",
      },
      popularity: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        comment: "类型人气",
      },
    },
    {
      sequelize,
      tableName: "article_type",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
      hooks: {
        // 文章类目删除钩子，删除oss封面以及类目下的其他文章
        beforeBulkDestroy: async (articleType, options) => {
          try {
            const articleService = require("../services/articleService"); // 避免循环依赖
            const ossService = require("../services/ossService"); // 避免循环依赖
            const articles = (
              await articleService.getAllArticleIdByTypeId(articleType.where.id)
            ).rows;
            const ids = articles.map((item) => item.dataValues.id);
            await articleService.deleteArticleById(ids); // 删除类目下的所有文章
            // 删除类目的封面
            await ossService.deleteFile(
              `/image/articleTypeCover/${articleType.where.id}.png`
            );
          } catch (e) {
            console.log(e);
            throw new Error(`删除文章类目时出错: ${error.message}`);
          }
        },
      },
    }
  );
};
