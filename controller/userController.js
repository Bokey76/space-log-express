const userService = require("../services/userService");
const utils = require("../utils/index");
const ossService = require("../services/ossService");
const mailService = require("../services/mailService");
const redisService = require("../services/redisService");
const tokenService = require("../services/tokenService");
const fs = require("fs");

module.exports = {
  // --获取--
  // 分页 获取用户
  getAllUser: async (req, res) => {
    res.json(
      await userService.getAllUser(req.params.currentPage, req.params.pageSize)
    );
  },
  // 分页 筛选搜索用户
  searchUser: async (req, res) => {
    res.json(
      await userService.searchUser(
        req.body.data,
        req.body.currentPage,
        req.body.pageSize
      )
    );
  },
  // 获取所有用户的id，name(用于select搜索)
  getAllUserIdAndName: async (req, res) => {
    res.json(await userService.getAllUserIdAndName());
  },
  // --登录--
  // 发送登录验证码
  sendLoginMail: async (req, res) => {
    if ((await mailService.sendCodeMail(req.body.mail)) != -1) {
      res.json(
        utils.postMessage(
          undefined,
          { message: "发送成功✅", description: "请留意邮箱验证码📧" },
          {}
        )
      );
      return;
    }
    res.json(
      utils.postMessage(
        -1,
        { message: "发送失败❗️", description: "请通过小红书或微博联系我😵‍💫" },
        {}
      )
    );
  },
  // 用户登录认证
  userLogin: async (req, res) => {
    const loginCode = await redisService.get(req.body.mail);
    if (loginCode && loginCode == req.body.code) {
      let userData = await userService.getUserByMail(req.body.mail); // 获取用户信息
      if (!userData) {
        userData = await userService.createUser({
          // 若不存在创建用户
          mail: req.body.mail,
          name: "momo",
        });
      }
      userData = userData.dataValues; // 得到数据
      userData.token = tokenService.getToken({ ...userData, power: "user" }); // 获取token并设置user权限
      res.json(
        utils.postMessage(
          undefined,
          utils.isVipCustomer(userData.mail)
            ? {
                message: "恭迎公主殿下🎉🎉🎉",
                description: "您的光临是小的最大的荣幸💌",
                grade: "vip",
              }
            : {
                message: "登录成功✅",
                description: "欢迎您~喜欢您来♻️",
                grade: "common",
              },
          userData
        )
      );
      return;
    }
    res.json(
      utils.postMessage(
        -1,
        { message: "验证码错误🔴", description: "请检查邮箱验证码后重试⛔️" },
        {}
      )
    );
  },
  // 通过token获取用户信息
  getUserDataByToken: async (req, res) => {
    let tokenData = tokenService.checkToken(req.headers["authorization"]);
    if (tokenData.code < 0) {
      res.json(
        utils.postMessage(
          -1,
          {
            message: "获取用户信息失败🔴",
            description: "登录令牌被串改⛔️",
          },
          {}
        )
      );
      return;
    }
    const userData = await userService.getUserById(tokenData.data.id);
    res.json(
      utils.postMessage(
        userData ? undefined : -1,
        userData
          ? "用户信息获取成功"
          : { message: "获取用户信息失败🔴", description: "该用户已被删除⛔️" },
        userData
      )
    );
  },

  // --修改--
  // 创建用户
  createUser: async (req, res) => {
    const userData = await userService.createUser({
      // 若不存在创建用户
      mail: req.body.mail,
      name: req.body.name,
    });
    res.json(utils.postMessage(undefined, "新建成功", userData));
  },
  // 更新用户信息
  updateUser: async (req, res) => {
    if (!tokenService.checkUserByToken(req, req.body.id)) {
      // 判断当前更改的是不是自己的数据
      res.json(
        utils.postMessage(
          -1,
          {
            message: "更新信息失败，请重试⛔️",
            description: "您当前更改的不是您的信息🚫",
          },
          {}
        )
      );
      return;
    }
    delete req.body.mail; // 删除邮箱属性，邮箱不能更改
    let [updatedCount] = await userService.updateUser(req.body);
    res.json(
      utils.postMessage(
        updatedCount > 0 ? undefined : -1,
        updatedCount > 0 ? "更新信息成功✨" : "更新信息失败，请重试❗️",
        {}
      )
    );
  },
  // 上传头像到oss
  uploadUserAvatar: async (req, res) => {
    let tokenData = tokenService.checkToken(req.headers["authorization"]);
    let result = {};
    const { fields, files, tempFilePath } = await ossService.readAndSaveFile(
      req
    );
    const ossPath =
      "/image/userAvatar/" +
      tokenData.data.id +
      '.png';
    result = await ossService.uploadFileStream(ossPath, tempFilePath);
    fs.unlinkSync(tempFilePath); // 删除临时文件
    res.json(
      utils.postMessage(
        result.code,
        { description: "你的肖像更完善了🌏", message: result.msg },
        {
          url: result.url,
          path: result.name,
        }
      )
    );
  },

  // --删除--
  // 删除用户
  deleteUserById: async (req, res) => {
    let status = await ossService.deleteFile(
      `/image/userAvatar/${req.query.id}.png`
    );
    res.json(
      utils.postMessage(
        status > 0 ? undefined : -1,
        status > 0 ? "删除成功" : "删除失败，请重试",
        status > 0 ? await userService.deleteUserById(req.query.id) : {}
      )
    );
  },
};
