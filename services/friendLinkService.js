const { FriendLink, Sequelize } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  // --获取--
  // 分页获取所有友链
  getAllFriendLinks: async () => {
    return await FriendLink.findAndCountAll();
  },
  // 随机获取友链，参数：除了exceptId这个id的友链
  getRandomFriendLinkId: async (exceptId) => {
    return await FriendLink.findOne({
      where: {
        id: {
          [Op.ne]: exceptId,
        },
        status: "active",
      },
      order: Sequelize.literal("RAND()"),
    });
  },
  // --修改--
  // 创建友链
  createFriendLink: async (friendLink) => {
    return await FriendLink.create(friendLink);
  },
  // 修改友链信息
  updateFriendLink: async (friendLink) => {
    return await FriendLink.update(friendLink, {
      where: { id: friendLink.id },
    });
  },
  // --删除--
  // 删除友链，可数组也可数字
  deleteFriendLinkById: async (id) => {
    return await FriendLink.destroy({
      where: { id: Array.isArray(id) ? { [Op.in]: id } : id },
    });
  },
};
