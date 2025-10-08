const jwt = require("jsonwebtoken");
const config = require("config");
const secretKey = config.get("tokenSecretKey"); // token密钥
module.exports = {
  /**
   * 加密获取token
   * @param {*} data 加密数据内容
   * @param {*} timeout 过期时间，默认10天
   * @returns 
   */
  getToken: (data, timeout = "10d") => {
    return jwt.sign(data, secretKey, { expiresIn: timeout });
  },
  /** 
   * 验证token
   * @param {String} token Bearer 开头会自动去除，可以直接传进来
   * */
  checkToken: (token) => {
    token = token && token.split(" ")[1] ? token.split(" ")[1] : token.split(" ")[0]; // 取出 Bearer 后的 token
    let result;
    try {
      result = jwt.verify(token, secretKey);
    } catch (e) {
      throw new Error("token校验出错："+e)
    }
    return {
      code: 200,
      data: result,
    };
  },
  /**
   * 验证当前用户身份
   * @param {Object} req 请求对象
   * @param {Int,String} userId 用户的id
   * @returns {Boolean} true认证成功，否则失败
   */
  checkUserByToken: (req,userId) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // 取出 Bearer 后的 token
    let tokenData =  module.exports.checkToken(token); // 取出token数据
    return tokenData.data.id == userId
  },
};
