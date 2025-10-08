var express = require("express");
var router = express.Router();
const configurationController = require("../controller/configurationController");
var { checkPermissions } = require("../middlewares/auth");

// 后台
router.get('/getAllConfiguration',checkPermissions(),configurationController.getAllConfiguration)
router.post('/addConfiguration',checkPermissions(),configurationController.createConfiguration)
router.post('/updateConfiguration',checkPermissions(),configurationController.updateConfiguration)
router.delete('/deleteConfiguration',checkPermissions(),configurationController.deleteConfigurationById)

// 客户端
router.get('/reception/getConfig',configurationController.getConfig)


module.exports = router;