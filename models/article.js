module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "article",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: "文章主键id",
      },
      topic: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "文章话题",
      },
      introduction: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "文章简介",
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "文章创建时间",
      },
      updatedTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "文章最后修改时间",
      },
      popularity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "文章人气",
      },
      like: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "文章点赞数",
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "文章类型id",
      },
      status: {
        type: DataTypes.ENUM("publish","archived","draft"),
        allowNull: false,
        defaultValue: "draft",
        comment: "文章状态",
      },
    },
    {
      sequelize,
      tableName: "article",
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
        // 文章的删除钩子，删除该文章的oss文件内容以及文章下的评论
        beforeBulkDestroy: async (article) => {
          const ossService = require("../services/ossService"); // 避免循环依赖
          const commentService = require("../services/commentService")
          let articleArr = [];
          if (typeof article.where.id == "string") {
            articleArr = [article.where.id];
          } else {
            for (const id of article.where.id[
              Object.getOwnPropertySymbols(article.where.id)[0]
            ]) {
              articleArr.push(id);
            }
          }
          try {
            for (const id of articleArr) {
              const articleImages = await ossService.getFileInPath(
                `/image/articleContent/${id}`
              ); // 获取文章图片目录的所有图片文件
              // 删除文章图片
              for (item of articleImages) {
                await ossService.deleteFile(item.name, false);
              }
              await ossService.deleteFile(`/file/article/${id}.md`);
              await ossService.deleteFile(`/image/articleCover/${id}.png`);
              const commentSearchData = await commentService.searchAllComment({
                entityType: "Article",
                entityId: id
              }) // 删除文章下的所有评论
              const commentIds = commentSearchData.rows.map(item => item.dataValues.id)
              await commentService.deleteCommentById(commentIds)
            }
          } catch (error) {
            throw new Error(`删除文章时出错: ${error.message}`);
          }
        },
      },
    }
  );
};
