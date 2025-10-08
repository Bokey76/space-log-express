const tokenService = require("../services/tokenService");
const redisService = require("../services/redisService");
const utils = require("../utils/index");

module.exports = {
  /**
   * 限制用户的文件上传频率中间件 seconds(s)内最多上传limit次
   * @param {Number} limit 限制次数，默认5次
   * @param {Number} seconds 限制秒数，默认300s（5分钟）
   * @param {String} limitKey 限制key（redis的key前缀），默认：'upload_limit'
   * @param {String,Object} msg 限制的返回信息，默认：限流拦截，请稍后重试
   */
  limitCustomerFileUpload: (
    limit,
    seconds,
    limitKey = "upload_limit",
    msg = "限流拦截，请稍后重试"
  ) => {
    return async (req, res, next) => {
      let tokenData = tokenService.checkToken(req.headers["authorization"]);
      const uploadLimitKey = `${limitKey}:${tokenData.data.id}`;
      let current = await redisService.get(uploadLimitKey);
      if (current === null) {
        await redisService.set(uploadLimitKey, 1, seconds);
        return next();
      }
      current = parseInt(current);
      if (current > limit) {
        utils.throwError(msg, 429);
      }
      await redisService.incr(uploadLimitKey);
      return next();
    };
  },
  /**
   * 限制用户的操作中间件 seconds(s)内最多上传limit次
   * @param {Number} limit 限制次数，默认5次
   * @param {Number} seconds 限制秒数，默认300s（5分钟）
   * @param {String} limitKey 限制key（redis的key前缀），默认：'upload_limit'
   * @param {String,Object} msg 限制的返回信息，默认：限流拦截，请稍后重试
   */
  limitCustomerAction: (
    limit,
    seconds,
    limitKey = "upload_limit",
    msg = "限流拦截，请稍后重试"
  ) => {
    return async (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress;
      console.log(ip);
      const uploadLimitKey = `${limitKey}:${ip}`;
      let current = await redisService.get(uploadLimitKey);
      if (current === null) {
        await redisService.set(uploadLimitKey, 1, seconds);
        return next();
      }
      current = parseInt(current);
      if (current > limit) {
        utils.throwError(msg, 429);
      }
      await redisService.incr(uploadLimitKey);
      return next();
    };
  },
};
