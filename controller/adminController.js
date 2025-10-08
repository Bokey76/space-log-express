const adminService = require("../services/adminService");
const mailService = require('../services/mailService')
const utils = require("../utils/index");
const redisService = require("../services/redisService");
const tokenService = require("../services/tokenService");

module.exports = {
  // --获取--
  // 分页获取管理员
  getAllAdmin: async (req, res) => {
    res.json(
      await adminService.getAllAdmin(
        req.params.currentPage,
        req.params.pageSize
      )
    );
  },
  // 分页 筛选搜索管理员
  searchAdmin: async (req, res) => {
    res.json(
      await adminService.searchAdmin(
        req.body.data,
        req.body.currentPage,
        req.body.pageSize
      )
    );
  },

  // --登录--
  // 发送登录验证码
  sendLoginMail: async (req, res) => {
    let adminData = await adminService.getAdminByMail(req.body.mail)
    if (!adminData) {
      res.json(utils.postMessage(-1, "暂无该管理员❗️请联系站长", {}));
      return
    }
    if ((await mailService.sendCodeMail(req.body.mail)) != -1) {
      res.json(utils.postMessage(undefined, "请留意邮箱验证码✅", {}));
      return;
    }
    res.json(utils.postMessage(-1, "验证码发送失败❗️请联系管理员", {}));
  },
  // 管理员登录认证
  adminLogin: async (req, res) => {
    const loginCode = await redisService.get(req.body.mail);
    if (loginCode == req.body.code) {
      let adminData = await adminService.getAdminByMail(req.body.mail); // 获取用户信息
      if (!adminData) {
        res.json(utils.postMessage(-1, "暂无该管理员❗️请联系站长", {}));
        return
      }
      adminData = adminData.dataValues; // 得到数据
      adminData.token = tokenService.getToken({ ...adminData, power: "admin" }); // 获取token并设置admin权限
      res.json(utils.postMessage(undefined, "登录成功✅欢迎您", adminData));
      return;
    }
    res.json(utils.postMessage(-1, "验证码错误❗️请检查重试", {}));
  },

  // --修改--
  // 创建管理员
  createAdmin: async (req, res) => {
    res.json(await adminService.createAdmin(req.body));
  },
  // 更新管理员
  updateAdmin: async (req, res) => {
    res.json(await adminService.updateAdmin(req.body));
  },

  //--删除--
  // 删除管理员
  deleteAdminById: async (req, res) => {
    res.json(await adminService.deleteAdminById(req.query.id));
  },
};
