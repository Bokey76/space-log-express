/**
 * 本文件介绍所需要的全局配置，config文件夹里是全局的配置，类似.env文件，代码会读取并应用对应配置
 * default.json - 默认的全局配置
 * dev.json - dev环境下的配置
 * beta.json - 测试环境下的配置
 * pro.json - 生产环境下的配置
 * 以下export的是所需的配置
 */
export default {
    "port": 3000,
    "mysql": {
      "host": "localhost",
      "user": "user",
      "password": "password",
      "database": "database name"
    },
    "oss": {
        "region": "oss-region",
        "accessKeyId": "oss-accessKeyId",
        "accessKeySecret": "oss-accessKeySecret",
        "bucket": "oss-bucket",
        "baseDir": "oss-base-dir"
    },
    "mail": {
      "user":"your-mail@gmail.com",
      "pass":"your-mail-pass"
    },
    "comment": {
      "entityType": ["Article", "Message"],
      "adminCustomerEmail": ["your-mail@gmail.com"]
    },
    "tokenSecretKey":"your-token-secret-key",
    "vipCustomerEmail": ["your-mail@gmail.com"]
}
  