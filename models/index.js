// sequelize 入口文件
const { Sequelize } = require("sequelize");
const config = require("config");

const mysqlConfig = config.get("mysql");

const sequelize = new Sequelize(
  mysqlConfig.database,
  mysqlConfig.user,
  mysqlConfig.password,
  {
    host: mysqlConfig.host,
    dialect: "mysql",
    port: 3306,
    timezone: "+08:00", // 设置为中国的时区（北京时间，UTC+8）
    pool: {
      //数据库连接池：放若干个数据库的连接对象，提高数据库的访问效率
      max: 20, //数据库连接池中连接对象的最大个数
      min: 3, //数据库连接池中连接对象的最少个数
      idle: 20000, //等待延迟的时间，单位是毫秒
    },
    define: {
      charset: "utf8", //处理Mysql中中文字符问题
    },
  }
);

// 数据库连接提示信息
sequelize
  .authenticate()
  .then(() => {
    console.log("Sequelize：数据库连接成功");
  })
  .catch((err) => {
    console.log("Sequelize：数据库连接失败 ", err);
  });

// 创建暴露模型对象
const db = {
  Sequelize,
  sequelize,
};

// 导入模型
db.Article = require("./article.js")(sequelize, Sequelize.DataTypes);
db.ArticleType = require("./articleType.js")(sequelize, Sequelize.DataTypes);
db.User = require("./user.js")(sequelize, Sequelize.DataTypes);
db.Comment = require("./comment.js")(sequelize, Sequelize.DataTypes);
db.Admin = require("./admin.js")(sequelize, Sequelize.DataTypes);
db.FriendLink = require("./friendLink.js")(sequelize,Sequelize.DataTypes)
db.Configuration = require("./configuration.js")(sequelize,Sequelize.DataTypes)

// 定义模型间的关系
db.ArticleType.hasMany(db.Article, {
  foreignKey: "typeId",
}); // 一个文章类型对应多个文章，外键为文章中的typeId字段
db.Article.belongsTo(db.ArticleType, {
  foreignKey: "typeId",
}); // 一个文章类型对应多个文章，外键为文章中的typeId字段
db.Article.hasMany(db.Comment, {
  foreignKey: "entityId",
});
db.Comment.belongsTo(db.Article, {
  foreignKey: "entityId",
});
db.User.hasMany(db.Comment, {
  foreignKey: "userId",
});
db.Comment.belongsTo(db.User, {
  foreignKey: "userId",
});
db.Comment.belongsTo(db.User, {
  foreignKey: "subUserId",
  as: "subUser"
});
db.Comment.hasMany(db.Comment, {
  foreignKey: "parentId",
  as: "children", // 定义关联别名
});

module.exports = db;
