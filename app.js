/**
=============================================================================
  Project: space-log-express
  Author: Bokey(github: Bokey76)
  Created: 2025
  License: MIT License
  Description: 
  本项目开源，欢迎参考、学习和改进。。
  请尊重作者版权，保留作者信息及本文件中的 LICENSE 注释。
  欢迎通过 Pull Request 或 Issue 方式提出改进意见，一起让项目更好。
  如果你喜欢本项目，欢迎点个 Star ⭐ 支持，也欢迎分享和改进。
  关于作者：https://bokey.space
 =============================================================================
 * 
 */

var createError = require("http-errors");
var express = require("express");
require('express-async-errors')
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors"); // 跨域

// 路由引入
var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var articleRouter = require("./routes/article");
var ossRouter = require("./routes/oss");
var adminRouter = require("./routes/admin");
var commentRouter = require("./routes/comment");
var friendLinkRouter = require("./routes/friendLink")
var configurationRouter = require("./routes/configuration")

// 中间件引入
var { checkToken, JwtErrorCatch } = require("./middlewares/auth");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(checkToken); // JWT认证 token合法性

// --路由使用--
app.use("/", indexRouter);
app.use("/article", articleRouter);
app.use("/user", userRouter);
app.use("/oss", ossRouter);
app.use("/admin", adminRouter);
app.use("/comment", commentRouter);
app.use("/friendLink",friendLinkRouter)
app.use('/configuration',configurationRouter)

// --错误处理--

// JWT 验证错误处理器
app.use(JwtErrorCatch);

// 404 处理中间件
app.use(function (req, res, next) {
  next(createError(404));
});

// 错误处理器
app.use(function (err, req, res, next) {
  const utils = require("./utils/index");
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  console.log('全局错误处理器捕捉到错误：',err);
  res.status(err.status || 500);
  if(err.msg) {
    err = err.msg
  } else if (err.message) {
    err = err.message
  }
  res.json(utils.postMessage(-1, err, {}));
});

module.exports = app;
