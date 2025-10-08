const configurationService = require("../services/configurationService");
const utils = require("../utils/index");

module.exports = {
  // --获取--
  // 后台获取配置
  getAllConfiguration: async (req, res) => {
    res.json(await configurationService.getAllConfiguration());
  },
  // 客户端获取配置
  getConfig: async (req, res) => {
    let data = await configurationService.getAllConfiguration();
    const result = {};
    data.rows.forEach((item) => {
      result[item.label] = item;
    });
    res.json(result);
  },
  /**
   * 添加配置
   * req.body: { label,content,env:[...] }
   */
  createConfiguration: async (req, res) => {
    try {
      res.json(
        utils.postMessage(
          undefined,
          "创建成功✅",
          await configurationService.createConfiguration(req.body)
        )
      );
    } catch (e) {
      console.log(e);
      res.json(utils.postMessage(-1, "创建失败", {}));
    }
  },
  // 更新配置
  updateConfiguration: async (req, res) => {
    try {
      res.json(
        utils.postMessage(
          undefined,
          "更新成功",
          await configurationService.updateConfiguration(req.body)
        )
      );
    } catch (e) {
      console.log(e);
      res.json(utils.postMessage(-1, `修改配置时出错:${e}`, {}));
    }
  },
  // --删除--
  // 删除配置
  deleteConfigurationById: async (req, res) => {
    res.json(
      utils.postMessage(
        undefined,
        "删除成功",
        await configurationService.deleteConfigurationById(req.query.id)
      )
    );
  },
};
