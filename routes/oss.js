const express = require("express");
const router = express.Router();
const ossController = require("../controller/ossController");
var { checkPermissions } = require("../middlewares/auth");
var { limitCustomerFileUpload } = require("../middlewares/rateLimit");

// 后台
router.get("/getFileInPath", checkPermissions(), ossController.getFileInPath);
router.post("/uploadImage", checkPermissions(), ossController.uploadImage);
router.post(
  "/uploadImageQueryIn",
  checkPermissions(),
  ossController.uploadImageQueryIn
);
router.delete("/deleteImage", checkPermissions(), ossController.deleteImage);

// 客户端
router.post(
  "/customer/uploadImage",
  limitCustomerFileUpload(5, undefined, "customer_upload_image", {
    message: "触发限制啦⛔️",
    description: "上传文件过于频繁，触发防脚本🤖，请稍后重试"
  }),
  ossController.customerUploadImage
);
router.delete(
  "/customer/deleteImage",
  ossController.customerDeleteImage
);

module.exports = router; // 导出路由器
