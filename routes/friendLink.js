var express = require("express");
var router = express.Router();
const friendLinkController = require("../controller/friendLinkController");
var { checkPermissions } = require("../middlewares/auth");
var { limitCustomerAction } = require("../middlewares/rateLimit");

// 公用
router.get(
  "/reception/getAllFriendLink",
  friendLinkController.getAllFriendLinks
);
router.post(
  "/reception/addFriendLink",
  limitCustomerAction(5, undefined, "customer_add_friend_link", {
    message: "触发限制啦⛔️",
    description: "友链申请过于频繁，触发防脚本🤖，请稍后重试",
  }),
  friendLinkController.createFriendLink
);

// 后台
router.post(
  "/updateFriendLink",
  checkPermissions(),
  friendLinkController.updateFriendLink
);
router.delete(
  "/deleteFriendLink",
  checkPermissions(),
  friendLinkController.deleteFriendLinkById
);
// 客户端
router.get(
  "/reception/getRandomFriendLink/:exceptId",
  friendLinkController.getRandomArticleId
);

module.exports = router;
