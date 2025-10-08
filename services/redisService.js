const client = require("../db/redis");

module.exports = {
  /**
   * 设置redis键值
   * @param {*} key redis键
   * @param {*} value 值
   * @param {Number} timeout 过期时间，单位s，默认五分钟
   */
  set: async (key, value, timeout=300) => {
    await client.set(key, value);
    if(timeout) {
        await client.expire(key,timeout)
    }
  },
  // 获取普通键值
  get: async (key) => {
    return await client.get(key);
  },
  // 删除键值
  del: async (key) => {
    return await client.del(key);
  },
  /**
   * redis原子性+1,若key不存在会创建并设置为0，若存在会将其值+1
   * @param {String} key 键
   * @returns {Function} 创建方法
   */
  incr: async(key) => {
    return await client.incr(key)
  },
  /**
   * 设置redis哈希(相当于对象{})键值
   * @param {*} key redis键
   * @param {*} value 值
   * @param {Number} timeout 过期时间，单位s，默认5分钟
   */
  hSet: async (key, hash,timeout=300) => {
    await client.hSet(key, hash)
    if(timeout) {
        await client.expire(key,timeout)
    }
  },
  // 获取哈希
  hGetAll: async (key) => {
    return await client.hGetAll(key);
  },
  // 关闭redis连接
  quit: async () => {
    console.log("redis连接已关闭");
    return await client.quit();
  },
};
