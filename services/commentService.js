const { Comment, User, Sequelize } = require("../models");
const config = require("config");
const commentConfig = config.get("comment");
const utils = require("../utils");
const { Op } = require("sequelize");

module.exports = {
  // --获取--
  /**
   * 分页获取所有评论，以及子评论数量
   * @param {Number} currentPage 当前页
   * @param {Number} pageSize 页大小，默认10
   * @param {Object} options 查询的相关配置{ childrenCountApprovedOrNot(Boolean，指定childrenCount的类型是否为approved),order:[''排序属性,''排序类型], ... }
   * @returns {Object} 返回格式 { count,rows[{...comment,childrenCount,user{}}] }
   */
  getAllComment: async (currentPage = 1, pageSize = 10, options = {}) => {
    let offset = (currentPage - 1) * pageSize;
    let selectOptions = {
      offset,
      limit: parseInt(pageSize),
      where: {
        parentId: null,
      },
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
      ],
      attributes: {
        include: [
          [
            options.childrenCountApprovedOrNot
              ? Sequelize.literal(`(
              SELECT COUNT(*) FROM comment AS child
              WHERE child.parentId = comment.id AND child.status = 'approved'
            )`)
              : Sequelize.literal(`(
          SELECT COUNT(*) FROM comment AS child
          WHERE child.parentId = comment.id
        )`),
            "childrenCount",
          ], // 计算每个父评论的子评论数量
        ],
      },
    }; 
    delete options.childrenCountApprovedOrNot;
    if(options.order) {
      selectOptions.order = JSON.parse(options.order)
    }
    delete options.order
    for (let key in options) {
      if (utils.isNullOrEmpty(options[key])) continue; // 若值为空，跳出
      if (key == "content") {
        selectOptions.where.content = { [Op.like]: "%" + options[key] + "%" };
      } else if (key == "time") {
        selectOptions.where.createTime = {
          [Op.between]: [new Date(options[key][0]), new Date(options[key][1])],
        };
      } else {
        selectOptions.where[key] = options[key];
      }
    }
    return await Comment.findAndCountAll(selectOptions); // 得到分页的数据
  },
  /**
   * 分页 筛选搜索所有评论(不会带子评论数量)
   * @param {Number} currentPage 当前页
   * @param {Number} pageSize 页大小
   * @param {Object} options 配置项目
   * @returns 
   */
  searchComment: async (currentPage = 1, pageSize = 10, options = {}) => {
    let offset = (currentPage - 1) * pageSize;
    let selectOptions = {
      offset,
      limit: parseInt(pageSize),
      where: {},
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "subUser",
          where: {
            id: Sequelize.col("Comment.subUserId"), // 使用 Comment 的 subUserId
          },
          attributes: ["name"],
          required: false,
        },
      ],
    };
    if(options.order) {
      selectOptions.order = JSON.parse(options.order)
    }
    delete options.order
    for (let key in options) {
      if (utils.isNullOrEmpty(options[key])) continue; // 若值为空，跳出
      if (key == "content") {
        selectOptions.where.content = { [Op.like]: "%" + options[key] + "%" };
      } else if (key == "time") {
        selectOptions.where.createTime = {
          [Op.between]: [new Date(options[key][0]), new Date(options[key][1])],
        };
      } else {
        selectOptions.where[key] = options[key];
      }
    }
    return await Comment.findAndCountAll(selectOptions); // 得到分页的数据
  },
  /**
   * 搜索获取所有评论，不会带子评论数量
   * @param {*} options { userMsg(为true表示携带用户信息),attributes:[](指定属性) }
   * @returns { Object } { row:[],count }
   */
  searchAllComment: async (options) => {
    let selectOptions = {
      where: {},
      include: [],
    };
    if (options.userMsg) { // 若添加用户信息
      selectOptions.include = [
        {
          model: User,
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "subUser",
          where: {
            id: Sequelize.col("Comment.subUserId"), // 使用 Comment 的 subUserId
          },
          attributes: ["name"],
          required: false,
        },
      ];
      delete options.userMsg;
    }
    if(options.attributes) { // 若指定属性
      selectOptions.attributes = options.attributes
      delete options.attributes
    }
    for (let key in options) {
      // 遍历option搜索
      if (utils.isNullOrEmpty(options[key])) continue; // 若值为空，跳出
      if (key == "content") {
        selectOptions.where.content = { [Op.like]: "%" + options[key] + "%" };
      } else if (key == "time") {
        selectOptions.where.createTime = {
          [Op.between]: [new Date(options[key][0]), new Date(options[key][1])],
        };
      } else {
        selectOptions.where[key] = options[key];
      }
    }
    return await Comment.findAndCountAll(selectOptions); // 得到分页的数据
  },
  /**
   * 获取评论的子评论
   * @param {int} parentCommentId 父评论的id
   * @param {Object} options 其他配置项
   * @returns {Object} 返回格式{ count, rows }
   */
  getChildComment: async (parentCommentId, options = {}) => {
    let selectOptions = {
      where: {
        parentId: parentCommentId,
      },
      include: [
        {
          model: User,
        },
        {
          model: User,
          as: "subUser",
          where: {
            id: Sequelize.col("Comment.subUserId"), // 使用 Comment 的 subUserId
          },
          attributes: ["name"],
          required: false,
        },
      ],
    };
    for (let key in options) {
      if (utils.isNullOrEmpty(options[key])) continue; // 若值为空，跳出
      if (key == "content") {
        selectOptions.where.content = { [Op.like]: "%" + options[key] + "%" };
      } else if (key == "time") {
        selectOptions.where.createTime = {
          [Op.between]: [new Date(options[key][0]), new Date(options[key][1])],
        };
      } else {
        selectOptions.where[key] = options[key];
      }
    }
    return await Comment.findAndCountAll(selectOptions);
  },
  // 通过id获取评论
  getCommentById: async (id) => {
    return await Comment.findByPk(id);
  },
  // 获取所有评论实体类型
  getAllCommentEntityType: async () => {
    return commentConfig.entityType;
  },
  // --修改--
  // 添加评论(用户)
  createComment: async (comment) => {
    return await Comment.create(comment);
  },
  // 创建评论(管理员)
  adminAddComment: async (comment) => {
    let newComment = await Comment.create(comment);
    // newComment.get({ plain: true }).status = "approved"; // 修改状态为审核通过
    // await newComment.save();
    return newComment;
  },
  // 修改评论信息
  updateComment: async (comment) => {
    return await Comment.update(comment, { where: { id: comment.id } });
  },
  // 喜欢评论
  likeComment: async (id) => {
    const comment = await Comment.findByPk(id); 
    if (!comment) {
      return false;
    }
    comment.like = comment.like + 1;
    await comment.save();
    return true;
  },
  // --删除--
  // 删除评论，可批量删除
  deleteCommentById: async (id) => {
    return await Comment.destroy({
      where: { id: id },
    });
  },
};
