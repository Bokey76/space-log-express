const config = require("config");
const commentConfig = config.get("comment");

module.exports = function (sequelize, DataTypes) {
  /**
   * 实体存在判断
   * @param {*} comment 评论对象
   * @returns 实体存在返回true，不存在返回false
   */
  const entityExistJudge = async (comment) => {
    if (comment.get({ plain: true }).entityType == "Article") {
      // 文章类型判断文章实体是否存在
      const articleService = require("../services/articleService");
      const utils = require("../utils/index");
      return !utils.isNullOrEmpty(
        await articleService.getArticleById(
          comment.get({ plain: true }).entityId
        )
      );
    }
    const noEntityType = ["Message"];
    if (noEntityType.includes(comment.get({ plain: true }).entityType)) {
      // 无实体类型，实体对象为-1
      comment.entityId = -1;
      return true;
    }
    return false;
  };

  return sequelize.define(
    "comment",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        comment: "评论id",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "评论内容",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "评论来自的用户id",
      },
      entityType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "被评论的实体类型",
      },
      entityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "被评论的实体id",
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "该评论的父级评论id",
      },
      createTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "评论创建时间",
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected","archived"),
        allowNull: false,
        defaultValue: "pending",
        comment: "评论状态",
      },
      subUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "该评论所评论子评论的用户id",
      },
      like: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "comment",
      timestamps: true,
      createdAt: "createTime",
      updatedAt: false, // 禁用更新时间字段
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "idxEntity",
          using: "BTREE",
          fields: [{ name: "entityType" }, { name: "entityId" }],
        },
        {
          name: "idxParent",
          using: "BTREE",
          fields: [{ name: "parentId" }],
        },
      ],
      hooks: {
        // 创建时拦截判断评论合法性
        beforeCreate: async (comment) => {
          const utils = require("../utils/index");
          const currentComment = comment.get({ plain: true })
          if (utils.isNullOrEmpty(currentComment.content)) {
            throw new Error("评论/留言内容不能为空哦🚦");
          }
          if (currentComment.content.length > 1500) {
            throw new Error("评论/留言内容限制大小为1500字符哦😵")
          }
          const commentService = require("../services/commentService");
          if (
            !commentConfig.entityType.includes(
              currentComment.entityType
            ) || // 若实体类型不存在
            !(await entityExistJudge(comment))
          ) {
            throw new Error("评论实体不存在或已删除🤷‍♂️");
          }
          if (!utils.isNullOrEmpty(currentComment.parentId)) {
            // 评论有父级评论
            const parentComment = await commentService.getCommentById(
              currentComment.parentId
            );
            if (
              utils.isNullOrEmpty(parentComment) ||
              parentComment.get({ plain: true }).entityId !=
              currentComment.entityId
            ) {
              // 父级评论实体不存在或评论实体不相同
              throw new Error("父级评论不存在或已删除🤷‍♂️");
            }
          }
          comment.status = "pending"; // 默认状态为：待审核
        },
        // 更新时拦截判断评论合法性
        beforeUpdate: async (comment) => {
          const utils = require("../utils/index");
          const commentService = require("../services/commentService");
          const currentComment = comment.get({ plain: true })
          if (
            !commentConfig.entityType.includes(
              currentComment.entityType
            ) || // 若实体类型不存在
            !(await entityExistJudge(comment))
          ) {
            throw new Error("评论实体不存在或已删除🤷‍♂️");
          }
          if (!utils.isNullOrEmpty(currentComment.parentId)) {
            // 评论有父级评论
            const parentComment = await commentService.getCommentById(
              currentComment.parentId
            );
            if (
              utils.isNullOrEmpty(parentComment) ||
              parentComment.get({ plain: true }).entityId !=
              currentComment.entityId
            ) {
              // 父级评论实体不存在或评论实体不相同
              throw new Error("父级评论不存在或已删除🤷‍♂️");
            }
          }
        },
        // 删除评论前，删除oss图片
        beforeBulkDestroy: async (comment) => {
          const ossService = require("../services/ossService"); // 避免循环依赖
          const commentService = require("../services/commentService");
          let commentArr = [];
          if (typeof comment.where.id == "string") {
            commentArr = [comment.where.id];
          } else {
            for (const id of comment.where.id[
              Object.getOwnPropertySymbols(comment.where.id)[0]
            ]) {
              commentArr.push(id);
            }
          }
          try {
            const hasImageCommentEntityType = ["Message"];
            for (const id of commentArr) {
              const commentItem = await commentService.getCommentById(id);
              if (
                hasImageCommentEntityType.includes(
                  commentItem.get({ plain: true }).entityType
                )
              ) {
                const commentImages = await ossService.getFileInPath(
                  `/image/messageImage/${commentItem.get({ plain: true }).userId == -1 ? "admin" : id}`
                ); // 获取评论的所有图片文件
                // 删除评论图片
                for (item of commentImages) {
                  await ossService.deleteFile(item.name, false);
                }
              }
            }
          } catch (error) {
            throw new Error(`删除评论图片时出错: ${error.message}`);
          }
        },
      },
    }
  );
};
