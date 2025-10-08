const { User, Sequelize } = require("../models");
const utils = require("../utils");
const { Op } = require("sequelize");

module.exports = {
  // --获取--
  // 分页获取所有用户
  getAllUser: async (currentPage = 1, pageSize = 10) => {
    let offset = (currentPage - 1) * pageSize;
    return await User.findAndCountAll({
      offset,
      limit: parseInt(pageSize),
    });
  },
  // 获取所有用户的id，name(用于select搜索)
  getAllUserIdAndName: async () => {
    return await User.findAndCountAll({
      attributes: ["id", "name"],
    });
  },
  // 通过邮箱获取用户
  getUserByMail: async (mail) => {
    return await User.findOne({
      where: {
        mail: mail,
      },
    });
  },
  // 分页筛选搜索用户
  searchUser: async (data, currentPage, pageSize) => {
    let offset = (currentPage - 1) * pageSize;
    let searchData = {
      offset,
      limit: parseInt(pageSize),
      where: {},
      order: [],
    };
    for (let item in data) {
      if (utils.isNullOrEmpty(data[item])) continue; // 若值为空，跳出
      if (item == "mail" || item == "name") {
        searchData.where[item] = { [Op.like]: "%" + data[item] + "%" };
      }
    }
    return await User.findAndCountAll(searchData);
  },
  // 通过id获取用户数据
  getUserById: async (id) => {
    return await User.findOne({ where: { id: id } });
  },
  // --修改--
  // 添加用户
  createUser: async (user) => {
    return await User.create(user);
  },
  // 修改用户信息
  updateUser: async (user) => {
    return await User.update(user, { where: { id: user.id } });
  },
  // --删除--
  deleteUserById: async (id) => {
    return await User.destroy({ where: { id: id } });
  },
};
