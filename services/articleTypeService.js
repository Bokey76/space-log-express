const { ArticleType, Article, Sequelize } = require("../models");
const { Op } = require("sequelize");
const utils = require("../utils");

module.exports = {
  // --获取--
  // 获取所有文章类目
  getAllArticleTypes: async () => {
    return await ArticleType.findAll();
  },
  // 分页 获取文章类目
  getArticleTypes: async (currentPage = 1, pageSize = 10) => {
    let offset = (currentPage - 1) * pageSize;
    return await ArticleType.findAndCountAll({
      offset,
      limit: parseInt(pageSize),
    });
  },
  // 通过id获取文章类目
  getArticleTypeById: async (id) => {
    return await ArticleType.findByPk(id);
  },
  // 通过时间，获取文章类别下的文章数量
  getArticleTypeNum: async (time) => {
    let searchData = {
      attributes: [
        "id",
        ["theme", "name"],
        "popularity",
        [Sequelize.fn("COUNT", Sequelize.col("articles.id")), "value"],
      ],
      include: [
        {
          model: Article,
          attributes: [],
          where: {},
        },
      ],
      group: ["article_type.id", "name", "article_type.popularity"],
    };
    if (!utils.isNullOrEmpty(time))
      searchData.include[0].where.createTime = {
        [Op.between]: [new Date(time[0]), new Date(time[1])],
      }; // 有时间范围，添加数据时间范围
    return await ArticleType.findAll(searchData);
  },
  // 通过时间，获取文章类别下的文章
  getArticleRelationsData: async (time) => {
    let searchData = {
      attributes: ["id", "theme","popularity"],
      include: [
        {
          model: Article,
          attributes: ["id", "topic","popularity","like"],
          where: {},
        },
      ],
    };
    if (!utils.isNullOrEmpty(time))
      searchData.include[0].where.createTime = {
        [Op.between]: [new Date(time[0]), new Date(time[1])],
      }; // 有时间范围，添加数据时间范围
    return await ArticleType.findAll(searchData);
  },

  // --修改--
  // 添加文章类目
  createArticleType: async (articleType) => {
    return await ArticleType.create(articleType);
  },
  // 更新文章类目
  updateArticleType: async (data) => {
    return await ArticleType.update(data, {
      where: { id: data.id },
    });
  },
  // --删除--
  // 删除文章类目
  deleteArticleTypeById: async(id) => {
    return await ArticleType.destroy({ where: { id: id } })
  },
};
