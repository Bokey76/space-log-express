# Bokey Space Backend

项目为日常分享、文章展示类项目，基本功能模块：
- 博客模块
- 评论模块（ps: 代码中暂时注释，打开可用，因为我的站点备案问题，暂时关闭评论功能）
- 留言模块（实际和评论是同一模块）
- 友链模块
- 全局配置模块

项目使用技术说明：

| 技术                                          | 说明                         |
| --------------------------------------------- | ---------------------------- |
| [Express](https://expressjs.com/)             | Node.js Web 应用框架 |
| [Sequelize](https://sequelize.org/)           | 基于 Promise 的 Node.js ORM 框架 |
| [MySQL](https://www.mysql.com/)               | 关系型数据库，用于数据存储与查询 |
| [Redis](https://redis.io/)                    | 内存型键值数据库，用于缓存与会话管理 |


### ⚙️ 环境要求

> Node.js：推荐 v18+（最低支持 v16）
> 可以使用 npm run / PM2 启动项目

#### ❗️必读事项
请先根据/config/example.js完善配置文件后再启动项目

### 项目启动 ✅

项目可以通过`npm run`,`pm2`三种方式启动

#### `npm run`启动

根据 npm script 来`run`项目：

```shell
npm run serve:dev # 开发环境，本地启动
npm run serve:beta # 测试环境，本地启动
npm run serve:pro # 生产环境，本地启动
```

#### `pm2`启动

根据`pm2`配置文件`ecosystem.config.cjs`来启动项目：

```shell
pm2 start ecosystem.config.js # 开发环境启动
pm2 start ecosystem.config.js --env beta # 测试环境启动
pm2 start ecosystem.config.js --env pro # 生产环境启动
```

### ⚖️ 开源协议

本项目基于 MIT License 开源。
你可以自由地使用、修改和再发布此项目，但请在明显位置保留以下作者标注：
Powered by Peacock · https://github.com/Bokey76
若在网页底部、关于页面、README 或其他可见位置保留此标识，将是对作者的尊重与支持 ❤️，感谢。

### 🌟 支持与反馈

如果这个项目对你有帮助，期待你的 Star ⭐支持！感谢！
你的支持是我持续改进与开源更多项目的动力 🙌。
如果项目使用时有bug🐞，欢迎提issue，我看到后会尽快修改修复（ps: 尽快哈，尽快😁）
如果有什么问题，可以通过我的网站找到我（虽然现在留言功能关闭了，日后可能会再开启，但站点里有联系方式可以找到我）

### 🧑‍💻 关于作者

<div style="display:flex;flex-direction: column;align-items:center;padding:20px 0;">
<img src="./public/images/bokey.png" alt="作者头像" width="200" style="border-radius: 50%;border: 10px solid #161616;" />
<h2 style="margin:10px 0 0">Bokey</h2>
<p style="font-weight:700;">在世界留下属于自己的痕迹🐾</p>
</div>

🌐 我的站点：[bokey space](https://bokey.space)

📧 联系方式：参考[bokey space](https://bokey.space)中提供的联系方式

💬 GitHub：https://github.com/Bokey76
