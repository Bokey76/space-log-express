const config = require("config");

module.exports = {
  /**
   * 封装发送消息
   * @param {Number} code 状态码，默认200
   * @param {String,Object} message 消息，默认为""，Object可选{message,description}
   * @param {*} data 发送数据
   * @returns {Object} { code: code, msg: message, data: data }
   */
  postMessage: (code = 200, message = "", data = {}) => {
    return {
      code: code,
      msg: message,
      data: data,
    };
  },
  /**
   * 判断是否为空
   * @param {*} obj 需要判断的对象
   * @returns {boolean} 是否为空
   *  */
  isNullOrEmpty(obj) {
    // 检查是否为null或undefined
    if (obj === null || obj === undefined) {
      return true;
    }
    // 检查是否为空对象
    if (typeof obj === "object" && Object.keys(obj).length === 0) {
      return true;
    }
    // 检查是否为空字符串
    if (typeof obj === "string" && obj.trim() === "") {
      return true;
    }
    // 如果以上条件都不满足，则认为不是null、undefined或空对象
    return false;
  },
  /**
   * 生成随机字符串
   * @param {Number} length 字符串长度，默认5
   * @returns {String} 返回随机字符串
   */
  getRandomChar(length = 5) {
    let code_str =
      "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    // 获取某个范围的随机整数，封装的函数，在上面抽取字典的时候进行了调用
    const getRandom = (min, max) => {
      //意思是获取min-max数字之间的某个随机数，直接调用即可
      return Math.round(Math.random() * (max - min) + min);
    };
    let newStr = ""; //创建一个空字符串，用来拼接四位随机码
    for (let i = 0; i < length; i++) {
      //for循环四次，则拼接四次随机码
      newStr += code_str[getRandom(0, code_str.length - 1)]; //从字典中随机选一个下标，并拼接到空字符串中
    }
    return newStr;
  },
  /**
   * 查看是否是管理员user
   * @param {String} email 邮箱
   * @returns {Boolean} yea or not
   */
  isAdminCustomer(mail) {
    const commentConfig = config.get("comment");
    return commentConfig.adminCustomerEmail.includes(mail)
  },
  /**
   * 查看是否是vip user
   * @param {String} email 邮箱
   * @returns {Boolean} yea or not
   */
  isVipCustomer(email) {
    const vipCustomerEmail = config.get("vipCustomerEmail");
    return vipCustomerEmail.includes(email)
  },
  /**
   * 抛出error
   * @param {String,Object} msg 错误信息，默认:'出现未知错误❌'，Object可选{message,description}
   * @param {Number} status 错误状态
   */
  throwError(msg='出现未知错误❌',status=500) {
    const err = new Error()
    err.status = status
    err.msg = msg
    throw err
  },
};
