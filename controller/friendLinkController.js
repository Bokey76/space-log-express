const friendLinkService = require("../services/friendLinkService");
const utils = require("../utils");

module.exports = {
  // --获取--
  getAllFriendLinks: async (req, res) => {
    res.json(await friendLinkService.getAllFriendLinks());
  },
  // 随机获取一个友链
  getRandomArticleId: async (req, res) => {
    let result = await friendLinkService.getRandomFriendLinkId(
      req.params.exceptId
    );
    res.json(result);
  },
  // --修改--
  // 添加友链
  createFriendLink: async (req, res) => {
    const friendLink = await friendLinkService.createFriendLink(req.body);
    res.json(utils.postMessage(undefined, {message: "提交成功✅",description: "链接建立中，站长会快速审核，感谢您的提交🌐"}, friendLink));
  },
  // 更新友链
  updateFriendLink: async (req, res) => {
    res.json(
      utils.postMessage(
        undefined,
        "更新成功",
        await friendLinkService.updateFriendLink(req.body)
      )
    );
  },
  // --删除--
  // 删除友链
  deleteFriendLinkById: async (req, res) => {
    res.json(
      utils.postMessage(
        undefined,
        "删除成功",
        await friendLinkService.deleteFriendLinkById(req.query.id)
      )
    );
  },
};
