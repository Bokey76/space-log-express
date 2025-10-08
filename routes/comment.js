var express = require("express");
var router = express.Router();
const commentController = require("../controller/commentController");
var { checkPermissions } = require("../middlewares/auth");

// 后台
router.get(`/getAllComment/:currentPage/:pageSize`,checkPermissions(),commentController.getAllComment)
router.post(`/searchComment`,checkPermissions(),commentController.searchComment)
router.post(`/searchAllComment`,checkPermissions(),commentController.searchAllComment)
router.get(`/getSubComment`,checkPermissions(),commentController.getChildComment)
router.get(`/getAllCommentEntityType`,checkPermissions(),commentController.getAllCommentEntityType)
router.post(`/adminAddComment`,checkPermissions(),commentController.adminAddComment)
router.post(`/updateComment`,checkPermissions(),commentController.updateComment)
router.delete(`/deleteComment`,checkPermissions(),commentController.deleteCommentById)

// 客户端
router.get(`/reception/customerGetComment/:currentPage/:pageSize`,commentController.customerGetAllComment)
router.get(`/reception/customerGetSubComment`,commentController.customerGetChildComment)
router.post(`/reception/likeComment`,commentController.likeComment)
router.post(`/addComment`,commentController.createComment)

module.exports = router;