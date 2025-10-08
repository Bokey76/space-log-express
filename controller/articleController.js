const articleService = require("../services/articleService");
const utils = require("../utils/index");
const ossService = require("../services/ossService");
const articleTypeService = require("../services/articleTypeService");

module.exports = {
  // --获取--
  // 分页 获取所有文章
  getAllArticles: async (req, res) => {
    res.json(
      await articleService.getAllArticles(
        req.params.currentPage,
        req.params.pageSize
      )
    );
  },
  // 管理员 筛选搜索所有文章
  adminSearchArticle: async (req, res) => {
    res.json(
      await articleService.searchArticle(
        req.body.data,
        req.body.currentPage,
        req.body.pageSize
      )
    );
  },
  // 分页 筛选搜索所有文章
  searchArticle: async (req, res) => {
    req.body.data.status = 'publish'
    console.log(req.body.data);
    res.json(
      await articleService.searchArticle(
        req.body.data,
        req.body.currentPage,
        req.body.pageSize
      )
    );
  },
  // 获取所有文章的主题和id
  getAllArticleIdAndTopic: async(req,res) => {
    res.json(await articleService.getAllArticleIdAndTopic())
  },
  // 获取文章内容
  getArticleContent: async (req, res) => {
    try {
      const content = await ossService.getFileContent(
        `/file/article/${req.params.id}.md`
      );
      const data = await articleService.getArticleById(req.params.id);
      data.popularity += 1; // 人气 + 1
      await data.save();
      res.json({
        content,
        data,
      });
    } catch (err) {
      console.error("oss文件读取失败:", err);
      res.status(500).json(utils.postMessage(-1, "文件读取失败", err));
    }
  },
  // 通过时间,获取文章的数据看台信息，包括1.浏览数 2.点赞数 3.文章数量 4.类目数
  getArticleNumData: async (req, res) => {
    res.json(await articleService.getArticleNumData(req.query.time));
  },
  // 通过时间，获取所有文章的 人气/点赞 数据
  getArticlePopularityAndLikeData: async (req, res) => {
    let result = await articleService.getArticlePopularityAndLikeData(
      req.query.time,
      req.query.currentPage,
      req.query.pageSize
    );
    let chartData = [["id", "topic", "popularity", "like"]];
    for (item of result.rows) {
      chartData.push([item.id, item.topic, item.popularity, item.like]);
    }
    res.json({ data: chartData, count: result.count });
  },
  // 随机获取一个文章id
  getRandomArticleId: async (req, res) => {
    let result = await articleService.getRandomArticleId(req.params.exceptId);
    res.json(result);
  },
  // 通过typeId获取文章
  getArticleByTypeId: async (req, res) => {
    typeData = await articleTypeService.getArticleTypeById(req.params.typeId);
    typeData.popularity += 1; // 文章类型人气 + 1
    typeData.save();
    res.json(
      await articleService.getArticleByTypeId(
        req.params.typeId,
        req.params.currentPage,
        req.params.pageSize
      )
    );
  },
  // --修改--
  // 添加新文章
  createArticle: async (req, res) => {
    let data = {
      ...req.body.data,
      createTime: new Date(),
      updatedTime: new Date(),
    };
    try {
      let article = await articleService.createArticle(data);
      await ossService.uploadOrUpdateFile(
        `/file/article/${article.dataValues.id}.md`,
        req.body.content
      );
      res.json(
        utils.postMessage(undefined, "保存成功", { id: article.dataValues.id })
      );
    } catch (e) {
      console.log(e);
      res.json(utils.postMessage(-1, "保存失败", {}));
    }
  },
  // 修改文章内容
  updateArticleContent: async (req, res) => {
    try {
      await ossService.uploadOrUpdateFile(
        `/file/article/${req.body.id}.md`,
        req.body.content
      );
      res.json(
        utils.postMessage(
          undefined ,
          "保存成功",
          {}
        )
      );
    } catch (e) {
      console.log(e);
      res.json(
        utils.postMessage(
          -1,
          "保存失败",
          {}
        )
      );
    }
  },
  // 修改文章信息
  updateArticleMsg: async (req, res) => {
    res.json(
      utils.postMessage(
        undefined,
        "修改成功",
        await articleService.updateArticleMsg(req.body)
      )
    );
  },
  // 喜欢文章
  likeArticle: async (req, res) => {
    let result = await articleService.likeArticle(req.body.id);
    res.json(
      utils.postMessage(
        result ? undefined : -1,
        result
          ? {
              message: "❤️点赞成功",
              description: "感谢喜欢，我会继续努力🎈",
            }
          : {
              message: "📌提示",
              description: "点赞出错啦，请稍后重试📍",
            },
        result
      )
    );
  },

  // --删除--
  // 删除文章
  deleteArticleById: async (req, res) => {
    try {
      res.json(
        utils.postMessage(
          undefined,
          "删除成功",
          await articleService.deleteArticleById(req.query.id)
        )
      );
    } catch (e) {
      res.json(
        utils.postMessage(
          undefined,
          "删除失败，请重试",
          await articleService.deleteArticleById(req.query.id)
        )
      );
    }
  },
};
