const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
var { checkPermissions } = require("../middlewares/auth");

router.get(
  "/getAllAdmin/:currentPage/:pageSize",
  checkPermissions(),
  adminController.getAllAdmin
);
router.post(
  "/searchAdmin",
  checkPermissions(),
  adminController.searchAdmin
);
router.post("/addAdmin", checkPermissions(), adminController.createAdmin);
router.post("/updateAdmin", checkPermissions(), adminController.updateAdmin);
router.delete(
  "/deleteAdminById",
  checkPermissions(),
  adminController.deleteAdminById
);
router.post("/reception/getLoginCode", adminController.sendLoginMail);
router.post("/reception/login", adminController.adminLogin);

module.exports = router;
