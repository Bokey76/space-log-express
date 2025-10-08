const utils = require("../utils/index");
const commentService = require("../services/commentService");
const tokenService = require("../services/tokenService");
const ossService = require("../services/ossService");
const fs = require("fs");

module.exports = {
  // --获取--
  // 分页 获取所有评论
  getAllComment: async (req, res) => {
    res.json(
      await commentService.getAllComment(
        req.params.currentPage,
        req.params.pageSize,
        req.query
      )
    );
  },
  // 分页 客户端获取评论
  customerGetAllComment: async (req, res) => {
    const options = {
      ...req.query,
      status: "approved", // 忽略客户端传输的status
      childrenCountApprovedOrNot: true, // childrenCount按照status为approved来计数
    };
    res.json(
      await commentService.getAllComment(
        req.params.currentPage,
        req.params.pageSize,
        options
      )
    );
  },
  // 分页 筛选搜索评论
  searchComment: async (req, res) => {
    res.json(
      await commentService.searchComment(
        req.body.currentPage,
        req.body.pageSize,
        req.body.data
      )
    );
  },
  // 搜索所有评论
  searchAllComment: async (req, res) => {
    res.json(await commentService.searchAllComment(req.body));
  },
  // 获取评论的所有子评论
  getChildComment: async (req, res) => {
    res.json(await commentService.getChildComment(req.query.id));
  },
  customerGetChildComment: async (req, res) => {
    const parentId = req.query.id;
    delete req.query.id;
    const options = {
      ...req.query,
      status: "approved", // 忽略客户端传输的status
    };
    res.json(await commentService.getChildComment(parentId, options));
  },
  // 获取所有评论实体类型
  getAllCommentEntityType: async (req, res) => {
    res.json(await commentService.getAllCommentEntityType());
  },
  // --修改--
  // 创建评论(用户)
  createComment: async (req, res) => {
    try {
      // 获取token的userId
      const tokenData = tokenService.checkToken(
        req.headers["authorization"]
      ).data;
      req.body.userId =
        tokenData.power == "admin" || utils.isAdminCustomer(tokenData.mail)
          ? -1
          : tokenData.id;
      res.json(
        utils.postMessage(
          undefined,
          req.body.userId == -1 ? "评论成功🟢" : "感谢评论🟢评论会被站长审核",
          await commentService.createComment(req.body)
        )
      );
    } catch (err) {
      res.json(utils.postMessage(-1, err.message, {}));
    }
  },
  // 上传评论图片到oss
  uploadCommentImage: async (req, res) => {
    let result = {};
    const { fields, files, tempFilePath } = await ossService.readAndSaveFile(
      req
    );
    const path = "/image/commentImage/" + req.query.id + path.extname(files.file[0].originalFilename);
    result = await ossService.uploadFileStream(path, tempFilePath);
    fs.unlinkSync(tempFilePath); // 删除临时文件
    res.json(
      utils.postMessage(
        result.code,
        { description: "评论图片上传成功✅", message: result.msg },
        {
          url: result.url,
          path: result.name,
        }
      )
    );
  },
  // 创建评论(管理员)
  adminAddComment: async (req, res) => {
    try {
      req.body.userId = -1; // 管理员
      res.json(
        utils.postMessage(
          undefined,
          "回复成功🟢",
          await commentService.adminAddComment(req.body)
        )
      );
    } catch (err) {
      res.json(utils.postMessage(-1, err.message, {}));
    }
  },
  // 更新评论
  updateComment: async (req, res) => {
    res.json(
      utils.postMessage(
        undefined,
        "修改成功✅",
        await commentService.updateComment(req.body)
      )
    );
  },
  // 喜欢评论
  likeComment: async (req, res) => {
    let result = await commentService.likeComment(req.body.id);
    res.json(
      utils.postMessage(
        result ? undefined : -1,
        result
          ? {
              message: "💫成功",
              description: "感谢反馈，这会帮助到更多人🌼",
            }
          : {
              message: "📌提示",
              description: "出错啦，请稍后重试📍",
            },
        result
      )
    );
  },
  // --删除--
  deleteCommentById: async (req, res) => {
    try {
      res.json(
        utils.postMessage(
          undefined,
          "删除成功✅",
          await commentService.deleteCommentById(req.query.id)
        )
      );
    } catch (e) {
      console.log(e);
      res.json(utils.postMessage(-1, e.message, {}));
    }
  },
};
