const utils = require("../utils/index");
const ossService = require("../services/ossService");
const tokenService = require("../services/tokenService");
const uuid = require("uuid");
let path = require("path");
const config = require("config");
const ossConfig = config.get("oss"); // oss配置

module.exports = {
  // 上传图片到指定oss路径
  uploadImage: async (req, res) => {
    let result = {};
    const { fields, files, tempFilePath } = await ossService.readAndSaveFile(
      req
    );
    const ossPath =
      fields.path[0] +
      (fields.uuidOrNot[0] == "true"
        ? uuid.v4() + path.extname(files.file[0].originalFilename)
        : files.file[0].originalFilename);
    result = await ossService.uploadFileStream(ossPath, tempFilePath);
    ossService.deleteLocalFile(tempFilePath);
    res.json(
      utils.postMessage(result.code, result.msg, {
        url: result.url,
        path: result.name,
      })
    );
  },
  // 上传图片（固定格式png）到指定oss路径，从请求路径获取oss的路径
  uploadImageQueryIn: async (req, res) => {
    let result = {};
    const { fields, files, tempFilePath } = await ossService.readAndSaveFile(
      req
    );
    const ossPath = req.query.path + ".png";
    result = await ossService.uploadFileStream(ossPath, tempFilePath);
    ossService.deleteLocalFile(tempFilePath); // 删除临时文件
    res.json(
      utils.postMessage(result.code, result.msg, {
        url: result.url,
        path: result.name,
      })
    );
  },
  // 客户端上传图片（固定格式png）
  customerUploadImage: async (req, res) => {
    let tokenData = tokenService.checkToken(req.headers["authorization"]);
    const allowFilePath = [
      "/temp/", // 测试
      `/image/messageImage/`,
    ]; // 限定oss文件路径
    const allowFileType = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "image/tiff",
      "image/heic",
      "image/x-icon",
      "	image/svg+xml",
    ]; // 限定文件类型
    let result = {};
    const { fields, files, tempFilePath } = await ossService.readAndSaveFile(
      req
    );
    if (
      !allowFilePath.includes(fields.path[0]) ||
      !allowFileType.includes(files.file[0].mimetype)
    ) {
      utils.throwError(
        {
          message: "文件上传失败❌",
          description: "请按上传规则上传文件（指定路径and图片格式）👀",
        },
        403
      );
    }
    const ossPath =
      fields.path[0] +
      tokenData.data.id +
      "/" +
      (fields.uuidOrNot[0] == "true"
        ? uuid.v4() + path.extname(files.file[0].originalFilename)
        : files.file[0].originalFilename);
    result = await ossService.uploadFileStream(ossPath, tempFilePath);
    ossService.deleteLocalFile(tempFilePath);
    res.json(
      utils.postMessage(result.code, result.msg, {
        url: result.url,
        path: result.name,
      })
    );
  },
  // 获取oss指定路径下的文件列表
  getFileInPath: async (req, res) => {
    res.json(
      await ossService.getFileInPath(req.query.path, req.query.delimiter)
    );
  },
  // 删除指定oss路径的图片
  deleteImage: async (req, res) => {
    let result = await ossService.deleteFile(req.query.path, false);
    res.json(utils.postMessage(result, result > 0 ? "删除成功" : "删除失败"));
  },
  // 客户端删除oss图片
  customerDeleteImage: async (req, res) => {
    let tokenData = tokenService.checkToken(req.headers["authorization"]);
    const allowFilePath = [
      `${ossConfig.baseDir}/temp/${tokenData.data.id}/`,
      `${ossConfig.baseDir}/image/messageImage/${tokenData.data.id}/`,
    ]; // 限定oss文件路径
    const lastSlashIndex = req.query.path.lastIndexOf("/");
    let directory = req.query.path.substring(0, lastSlashIndex + 1); // 去除文件名，得到目录
    if (!directory.startsWith("/")) directory = "/" + directory;
    if (allowFilePath.includes(directory)) {
      let result = await ossService.deleteFile(req.query.path, false);
      res.json(
        utils.postMessage(result, result > 0 ? "删除成功✅" : "删除失败❌")
      );
    } else {
      utils.throwError(
        {
          message: "无权删除该文件❌",
          description: "只能删除指定路径的文件哟👀",
        },
        403
      );
    }
  },
};
