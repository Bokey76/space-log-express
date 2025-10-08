const { Admin, Sequelize } = require("../models");
const utils = require("../utils");
const { Op } = require("sequelize");

module.exports = {
  // --获取--
  // 分页获取所有管理员
  getAllAdmin: async (currentPage = 1, pageSize = 10) => {
    let offset = (currentPage - 1) * pageSize;
    return await Admin.findAndCountAll({
      offset,
      limit: parseInt(pageSize),
    });
  },
  // 分页筛选搜索管理员
  searchAdmin: async (data,currentPage,pageSize) => {
    let offset = (currentPage - 1) * pageSize;
    let searchData = {
      offset,
      limit: parseInt(pageSize),
      where: {},
      order: [],
    };
    for (let item in data) {
      if (utils.isNullOrEmpty(data[item])) continue; // 若值为空，跳出
      if(item == "mail") {
        searchData.where[item] = { [Op.like]: "%" + data[item] + "%" };
      }
    }
    return await Admin.findAndCountAll(searchData)
  },
  // 通过邮箱获取管理员信息
  getAdminByMail: async (mail) => {
    return await Admin.findOne({ where: { mail: mail } });
  },
  // --修改--
  // 添加管理员
  createAdmin: async (admin) => {
    return await Admin.create(admin);
  },
  // 修改管理员信息
  updateAdmin: async (admin) => {
    return await Admin.update(admin, { where: { id: admin.id } });
  },

  // --删除--
  deleteAdminById: async (id) => {
    return await Admin.destroy({ where: { id: id } });
  },
};
