// 权限检查中间件
const config = require("config");
const secretKey = config.get("tokenSecretKey"); // token密钥
const { expressjwt } = require("express-jwt");
const tokenService = require("../services/tokenService");

// 不用token认证的接口
unlessArr = [
  /\/.*\/reception\/.*/,
];
// 不用admin权限，但需要user权限的接口
adminUnless = [];

module.exports = {
  // 全局检查token合法性中间件
  checkToken: expressjwt({ secret: secretKey, algorithms: ["HS256"] }).unless({
    path: unlessArr,
  }),
  /**
   * 路由检查token权限中间件
   * @param {String} requiredPower 需要的权限字段，默认admin，可选admin、user
   */
  checkPermissions: (requiredPower = "admin") => {
    return (req, res, next) => {
      // 获取请求头中的 token
      const obj = tokenService.checkToken(req.headers["authorization"]); // 得到token内容
      if (
        obj &&
        obj.code > 0 &&
        obj.data.power &&
        obj.data.power == requiredPower
      ) {
        return next(); // 用户有权限，继续请求
      } else {
        res.json({ code: -1, message: "权限不足" }); // 权限不足
      }
    };
  },
  // JWT的token认证错误中间件
  JwtErrorCatch: (err, req, res, next) => {
    if (err.name === "UnauthorizedError") { // 判断是否是 JWT 错误
      let msg = "无效的令牌🔑请登录后重试"
      switch(req.path) {
        case '/comment/addComment':
          msg = {
            message: "评论失败，未登录⭕️",
            description: "请登录后再发送评论叭~邮箱登录很快的🙂‍"
          }
          break;
        case '/oss/customer/uploadImage':
          msg = {
            message: "上传失败⭕️",
            description: "请登录后再上传叭~邮箱登录很快的🙂‍"
          }
          break;
      }
      return res.json({
        code: -1,
        msg: msg,
        data: {},
      });
    }
    return next(err); // 如果不是 JWT 错误，继续处理下一个中间件
  },
};
