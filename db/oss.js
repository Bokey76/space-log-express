// 初始化Client
let OSS = require('ali-oss');
const config = require("config");
const ossConfig = config.get('oss');
let client = new OSS({
  region: ossConfig.region,
  accessKeyId: ossConfig.accessKeyId,
  accessKeySecret: ossConfig.accessKeySecret,
  bucket: ossConfig.bucket,
});
module.exports = {
    client
};