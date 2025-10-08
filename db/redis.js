const redis = require("redis");
const client = redis.createClient(); //默认没有密码 127.0.0.1  端口也是默认
// 连接远程
// redis[s]://[[username][:password]@][host][:port][/db-number]:
// const client = createClient({
// 	url: 'redis://alice:foobared@awesome.redis.server:6380'
// });

client.on("error", (err) => console.log("Redis连接失败", err));

client.on("connect", () => {
  console.log("redis连接成功");
});

client.connect();

module.exports = client;
