const express = require('express');
const router = express.Router();
const articleController = require('../controller/articleController');
const articleTypeController = require('../controller/articleTypeController');
var { checkPermissions } = require("../middlewares/auth");

// --文章--
router.get('/getAllArticles/:currentPage/:pageSize', articleController.getAllArticles);
router.post('/searchArticle',checkPermissions(), articleController.adminSearchArticle);
router.get('/getArticleNumData', articleController.getArticleNumData);
router.get('/getAllArticleIdAndTopic',checkPermissions(), articleController.getAllArticleIdAndTopic);
router.get('/getArticlePopularityAndLikeData', articleController.getArticlePopularityAndLikeData);
router.post('/addArticle',checkPermissions(), articleController.createArticle);
router.post('/updateArticleContent',checkPermissions(), articleController.updateArticleContent);
router.post('/updateArticleMsg',checkPermissions(), articleController.updateArticleMsg);
router.delete('/deleteArticle',checkPermissions(), articleController.deleteArticleById);
// 开放
router.get('/reception/getRandomArticleId/:exceptId', articleController.getRandomArticleId);
router.get('/reception/getArticleByTypeId/:typeId/:currentPage/:pageSize', articleController.getArticleByTypeId);
router.post('/reception/searchArticle', articleController.searchArticle);
router.get('/reception/getArticleContent/:id', articleController.getArticleContent);
router.post('/reception/likeArticle', articleController.likeArticle);

// --文章类目--
router.post('/addArticleType',checkPermissions(), articleTypeController.createArticleType);
router.get('/getArticleTypes/:currentPage/:pageSize', articleTypeController.getArticleTypes);
router.get('/getArticleTypeNum', articleTypeController.getArticleTypeNum);
router.get('/getArticleRelationsData', articleTypeController.getArticleRelationsData);
router.post('/updateArticleType',checkPermissions(), articleTypeController.updateArticleType);
router.delete('/deleteArticleType',checkPermissions(),articleTypeController.deleteArticleTypeById)
// 开放
router.get('/reception/getArticleTypeById/:id', articleTypeController.getArticleTypeById);
router.get('/reception/getAllArticleTypes', articleTypeController.getAllArticleTypes);

module.exports = router;
