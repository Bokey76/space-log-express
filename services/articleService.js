const { Article, Sequelize } = require("../models");
const utils = require("../utils");
const { Op } = require("sequelize");

module.exports = {
  // --获取--
  // 分页 获取所有文章
  getAllArticles: async (currentPage = 1, pageSize = 10) => {
    let offset = (currentPage - 1) * pageSize;
    return await Article.findAndCountAll({
      offset,
      limit: parseInt(pageSize),
    });
  },
  // 分页 筛选搜索所有文章
  searchArticle: async (data, currentPage = 1, pageSize = 10) => {
    let offset = (currentPage - 1) * pageSize;
    let searchData = {
      offset,
      limit: parseInt(pageSize),
      where: {},
      order: [],
    };
    for (let item in data) {
      if (utils.isNullOrEmpty(data[item])) continue; // 若值为空，跳出
      if (item == "topic" || item == "typeId") {
        searchData.where[item] = { [Op.like]: "%" + data[item] + "%" };
      } else if (item == "time") {
        searchData.where["createTime"] = {
          [Op.between]: [new Date(data[item][0]), new Date(data[item][1])],
        };
      } else if (
        (data[item] && item == "popularity") ||
        (data[item] && item == "like")
      ) {
        searchData.order.push([item, "desc"]);
      } else if (data[item] && item == "orderByTime") {
        searchData.order.push(["createTime", "desc"]);
      } else if (["status"].includes(item)) {
        searchData.where[item] = data[item];
      }
    }
    return await Article.findAndCountAll(searchData);
  },
  // 通过id获取文章
  getArticleById: async (id) => {
    return await Article.findOne({ where: { id: id } });
  },
  // 获取所有文章的的id，topic(用于select搜索)
  getAllArticleIdAndTopic: async () => {
    return await Article.findAndCountAll({
      attributes: ["id", "topic"],
    });
  },
  // 随机获取文章id
  getRandomArticleId: async (exceptId) => {
    return await Article.findOne({
      attributes: ["id"],
      where: {
        id: {
          [Op.ne]: exceptId,
        },
        status: "publish",
      },
      order: Sequelize.literal("RAND()"),
    });
  },
  // 通过typeId获取文章 分页
  getArticleByTypeId: async (typeId, currentPage = 1, pageSize = 10) => {
    let offset = (currentPage - 1) * pageSize;
    return await Article.findAndCountAll({
      where: { typeId: typeId, status: "publish" },
      offset,
      limit: parseInt(pageSize),
    });
  },
  // 通过typeId获取所有文章id
  getAllArticleIdByTypeId: async (typeId) => {
    return await Article.findAndCountAll({
      attributes: ["id"],
      where: { typeId: typeId },
    });
  },
  // 通过时间 获取文章的数据看台信息 包括1.浏览数 2.点赞数 3.文章数量 4.类目数
  getArticleNumData: async (time) => {
    let searchData = {
      attributes: [
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("SUM", Sequelize.col("popularity")),
            0
          ),
          "popularity",
        ],
        [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("SUM", Sequelize.col("like")),
            0
          ),
          "like",
        ],
        [Sequelize.fn("COUNT", "*"), "articleCount"],
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.fn("DISTINCT", Sequelize.col("typeId"))
          ),
          "articleTypeCount",
        ],
      ],
      where: {},
    };
    if (!utils.isNullOrEmpty(time))
      searchData.where.createTime = {
        [Op.between]: [new Date(time[0]), new Date(time[1])],
      }; // 有时间范围，添加数据时间范围
    return await Article.findOne(searchData);
  },
  // 通过时间 获取文章 人气 / 点赞数 数据
  getArticlePopularityAndLikeData: async (
    time,
    currentPage = 1,
    pageSize = 10
  ) => {
    let offset = (currentPage - 1) * pageSize;
    let searchData = {
      offset,
      attributes: ["id", "topic", "popularity", "like"],
      limit: parseInt(pageSize),
      where: {},
    };
    if (!utils.isNullOrEmpty(time))
      searchData.where.createTime = {
        [Op.between]: [new Date(time[0]), new Date(time[1])],
      }; // 有时间范围，添加数据时间范围
    return await Article.findAndCountAll(searchData);
  },
  // --修改--
  // 添加文章
  createArticle: async (article) => {
    return await Article.create(article);
  },
  // 修改文章信息
  updateArticleMsg: async (article) => {
    return await Article.update(article, { where: { id: article.id } });
  },
  // 喜欢文章
  likeArticle: async (id) => {
    const article = await Article.findByPk(id);
    if (!article) {
      return false;
    }
    article.like = article.like + 1;
    await article.save();
    return true;
  },
  // --删除--
  // 删除文章 可传数组也可数字
  deleteArticleById: async (id) => {
    return await Article.destroy({
      where: { id: Array.isArray(id) ? { [Op.in]: id } : id },
    });
  },
};
