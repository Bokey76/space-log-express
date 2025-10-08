const articleTypeService = require("../services/articleTypeService");
const utils = require("../utils/index");

module.exports = {
  // --获取--
  // 获取所有文章类型
  getAllArticleTypes: async (req, res) => {
    res.json(await articleTypeService.getAllArticleTypes());
  },
  // 分页获取所有文章类目
  getArticleTypes: async (req, res) => {
    res.json(
      await articleTypeService.getArticleTypes(
        req.params.currentPage,
        req.params.pageSize
      )
    );
  },
  // 通过id获取文章类别信息
  getArticleTypeById: async (req, res) => {
    res.json(await articleTypeService.getArticleTypeById(req.params.id));
  },
  // 通过时间，获取文章类别下的文章数量
  getArticleTypeNum: async (req, res) => {
    res.json(await articleTypeService.getArticleTypeNum(req.query.time));
  },
  // 通过时间，获取文章类别下的文章
  getArticleRelationsData: async (req, res) => {
    let data = await articleTypeService.getArticleRelationsData(req.query.time);
    let nodes = []; // 节点
    let links = []; // 关系连接
    let categories = []; // 类别
    for (let index in data) {
      // 遍历类别
      let type = data[index];
      nodes.push({
        // 添加节点
        id: "type_" + type.id,
        type: "articleType",
        value: {
          人气: type.popularity,
        },
        name: type.theme,
        category: Number(index),
      });
      categories.push({ name: type.theme }); // 添加关系图类别
      for (let article of type.articles) {
        // 遍历该类别中的文章
        nodes.push({
          // 添加节点
          id: "article_" + article.id,
          type: "article",
          value: {
            id: article.id,
            主题: article.topic,
            人气: article.popularity,
            点赞: article.like,
          },
          name: article.topic,
          category: Number(index),
        });
        links.push({
          // 添加关系
          source: "type_" + type.id,
          target: "article_" + article.id,
        });
      }
    }
    res.json({ nodes, links, categories });
  },
  // --修改--
  // 添加文章类型
  createArticleType: async (req, res) => {
    res.json(
      utils.postMessage(
        undefined,
        "添加成功",
        await articleTypeService.createArticleType(req.body)
      )
    );
  },
  // 更新文章类目数据
  updateArticleType: async (req, res) => {
    res.json(
      utils.postMessage(
        undefined,
        "更新成功",
        await articleTypeService.updateArticleType(req.body)
      )
    );
  },
  // --删除--
  deleteArticleTypeById: async (req, res) => {
    try {
      // 删除类目
      res.json(
        utils.postMessage(
          undefined,
          "删除成功",
          await articleTypeService.deleteArticleTypeById(req.query.id)
        )
      );
    } catch (err) {
      res.json(utils.postMessage(-1, `删除失败，请重试，${err}`, undefined));
      return;
    }
  },
};
