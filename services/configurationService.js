const { Configuration, Sequelize } = require("../models");

module.exports = {
  // --获取--
  // 获取全部配置
  getAllConfiguration: async () => {
    return await Configuration.findAndCountAll();
  },
  // --修改--
  // 创建一个配置
  createConfiguration: async (configuration) => {
    try {
      if (configuration.type == "JSON") {
        // 若是JSON格式，转化成JSON存入数据库
        // 去除 空格 \n，将'替换成"
        configuration.content = configuration.content
          // .replace(/\s+/g, "")
          .replace(/'/g, '"')
          .replace(/\n/g, "");
        configuration.content = JSON.parse(configuration.content);
      }
      return await Configuration.create(configuration);
    } catch (e) {
      console.log(e);
      throw new Error(`修改配置时出错: ${e.message}`);
    }
  },
  // 修改配置信息
  updateConfiguration: async (configuration) => {
    try {
      if (configuration.type == "JSON") {
        // 若是JSON格式，转化成JSON存入数据库
        // 去除 \n，将'替换成"
        configuration.content = configuration.content
          // .replace(/\s+/g, "")
          .replace(/'/g, '"')
          .replace(/\n/g, "");
        configuration.content = JSON.parse(configuration.content);
      }
      return await Configuration.update(configuration, {
        where: { id: configuration.id },
      });
    } catch (e) {
      console.log(e);
      throw new Error(`修改配置时出错: ${e.message}`);
    }
  },
  // --删除--
  // 删除配置，可数组也可数字
  deleteConfigurationById: async (id) => {
    return await Configuration.destroy({
      where: { id: Array.isArray(id) ? { [Op.in]: id } : id },
    });
  },
};
